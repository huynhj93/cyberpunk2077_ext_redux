import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import {
  FileTree,
  sourcePaths,
  pathInTree,
  filesUnder,
  FILETREE_ROOT,
  Glob,
  fileTreeFromPaths,
} from "./filetree";
import {
  CoreRed4extLayout,
  CORE_RED4EXT_GENERATED_DIRS,
  DEPRECATED_RED4EXT_CORE_REQUIRED_FILES,
  Instructions,
  InvalidLayout,
  Layout,
  MaybeInstructions,
  NoInstructions,
  NoLayout,
  RED4EXT_CORE_REQUIRED_FILES,
} from "./installers.layouts";
import { InstallDecision, InstallerType } from "./installers.types";
import {
  VortexWrappedTestSupportedFunc,
  VortexApi,
  VortexLogFunc,
  VortexTestResult,
  VortexWrappedInstallFunc,
  VortexProgressDelegate,
} from "./vortex-wrapper";
import { instructionsForSameSourceAndDestPaths, instructionsToGenerateDirs, useFirstMatchingLayoutForInstructions } from './installers.shared';
import { promptUserToInstallOrCancelOnDeprecatedCoreMod, showWarningForUnrecoverableStructureError } from './ui.dialogs';

// Recognizers

const detectCoreRed4extLayout = (fileTree: FileTree): boolean =>
  pipe(
    RED4EXT_CORE_REQUIRED_FILES,
    RA.every(
      (requiredFile) => pathInTree(requiredFile, fileTree),
    ),
  );

const detectDeprecatedCoreRed4extLayout = (fileTree: FileTree): boolean =>
  pipe(
    DEPRECATED_RED4EXT_CORE_REQUIRED_FILES,
    RA.every(
      (requiredFile) => pathInTree(requiredFile, fileTree),
    ),
  );

const detectCoreRed4ext = (fileTree: FileTree): boolean =>
  detectCoreRed4extLayout(fileTree) || detectDeprecatedCoreRed4extLayout(fileTree);

export const testRed4ExtCore: VortexWrappedTestSupportedFunc = (
  api: VortexApi,
  log: VortexLogFunc,
  files: string[],
  fileTree: FileTree,
): Promise<VortexTestResult> =>
  Promise.resolve({
    supported:
          detectCoreRed4ext(fileTree),
    requiredFiles: [],
  });

//
// Layouts
//
const layout = (
  _api: VortexApi,
  _modName: string,
  fileTree: FileTree,
  layoutType: Layout,
  layoutMatcher: (fileTree: FileTree) => boolean,
): MaybeInstructions => {
  //
  if (!layoutMatcher(fileTree)) {
    return NoInstructions.NoMatch;
  }

  const allProvidedFiles = filesUnder(FILETREE_ROOT, Glob.Any, fileTree);

  const fileInstructions =
    instructionsForSameSourceAndDestPaths(allProvidedFiles);

  const generatedInstructions =
    instructionsToGenerateDirs(CORE_RED4EXT_GENERATED_DIRS);

  const allInstructions = [...fileInstructions, ...generatedInstructions];

  return {
    kind: layoutType,
    instructions: allInstructions,
  };
};

const coreRed4extLayout = (
  _api: VortexApi,
  _modName: string,
  fileTree: FileTree,
): MaybeInstructions =>
  layout(_api, _modName, fileTree, CoreRed4extLayout.OnlyValid, detectCoreRed4extLayout);

const deprecatedCoreRed4ExtLayout = (
  _api: VortexApi,
  _modName: string,
  fileTree: FileTree,
): MaybeInstructions =>
  layout(_api, _modName, fileTree, CoreRed4extLayout.Deprecated, detectDeprecatedCoreRed4extLayout);

// Prompts

const warnUserIfDeprecatedRed4ext = async (
  api: VortexApi,
  chosenInstructions: Instructions,
): Promise<InstallDecision> => {
  // Trying out the tree-based approach..
  const destinationPaths = chosenInstructions.instructions.map((i) => i.destination);
  const newTree = fileTreeFromPaths(destinationPaths);

  const containsDeprecatedRed4ExtPaths = DEPRECATED_RED4EXT_CORE_REQUIRED_FILES.every((red4extPath) =>
    filesUnder(FILETREE_ROOT, Glob.Any, newTree).includes(red4extPath));

  if (containsDeprecatedRed4ExtPaths) {
    return promptUserToInstallOrCancelOnDeprecatedCoreMod(
      api,
      InstallerType.CoreRed4ext,
      filesUnder(FILETREE_ROOT, Glob.Any, newTree),
    );
  }

  return InstallDecision.UserWantsToProceed;
};

export const coreRed4extInstructions = async (
  api: VortexApi,
  fileTree: FileTree,
): Promise<Instructions> => {
  const allPossibleCoreRed4extLayouts = [
    coreRed4extLayout,
    deprecatedCoreRed4ExtLayout,
  ];
  const selectedInstructions = useFirstMatchingLayoutForInstructions(
    api,
    undefined,
    fileTree,
    allPossibleCoreRed4extLayouts,
  );
  if (
    selectedInstructions === NoInstructions.NoMatch ||
    selectedInstructions === InvalidLayout.Conflict
  ) {
    //
    const errorMessage = `Didn't Find Expected Core RED4ext Installation!`;
    api.log(
      `error`,
      `${InstallerType.CoreRed4ext}: ${errorMessage}`,
      sourcePaths(fileTree),
    );
    showWarningForUnrecoverableStructureError(
      api,
      InstallerType.CoreRed4ext,
      errorMessage,
      sourcePaths(fileTree),
    );
    return ({ kind: NoLayout.Optional, instructions: [] });
  }

  if (selectedInstructions.kind === CoreRed4extLayout.Deprecated) {
    const infoMessage = `Old RED4ext version!`;
    api.log(`info`, `${InstallerType.CoreRed4ext}: ${infoMessage} Confirming installation.`);

    const confirmedInstructions = await warnUserIfDeprecatedRed4ext(api, selectedInstructions);

    if (confirmedInstructions === InstallDecision.UserWantsToCancel) {
      const cancelMessage = `${InstallerType.CoreRed4ext}: user chose to cancel installing deprecated version`;

      api.log(`warn`, cancelMessage);
      return Promise.reject(new Error(cancelMessage));
    }

    api.log(
      `info`,
      `${InstallerType.ConfigXml}: User confirmed installing deprecated version`,
    );
  }

  return selectedInstructions;
};

// install

export const installRed4ExtCore: VortexWrappedInstallFunc = async (
  api: VortexApi,
  _log: VortexLogFunc,
  _files: string[],
  fileTree: FileTree,
  _destinationPath: string,
  _progressDelegate: VortexProgressDelegate,
) => {
  //
  const selectedInstructions = await coreRed4extInstructions(
    api,
    fileTree,
  );

  return Promise.resolve({ instructions: selectedInstructions.instructions });
};
