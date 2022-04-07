// The instructions will be grouped in the order that we try
// to match things, and normally within them.

import path from "path";
import { InstallChoices } from "../../src/dialogs";
import {
  CONFIG_XML_MOD_BASEDIR,
  CONFIG_JSON_MOD_PROTECTED_FILES,
  CONFIG_JSON_MOD_BASEDIR_SETTINGS,
} from "../../src/installers.layouts";
import { InstallerType } from "../../src/installers.types";
import {
  ExampleSucceedingMod,
  copiedToSamePath,
  FAKE_MOD_NAME,
  pathHierarchyFor,
  ExamplePromptInstallableMod,
  ARCHIVE_PREFIX,
  ARCHIVE_PREFIXES,
  CET_INIT,
  CET_PREFIX,
  CET_PREFIXES,
  RED4EXT_PREFIX,
  RED4EXT_PREFIXES,
  REDS_PREFIX,
  REDS_PREFIXES,
  TWEAK_XL_PATH,
  TWEAK_XL_PATHS,
  XML_PREFIXES,
  expectedUserCancelMessageFor,
  expectedUserCancelProtectedMessageInMultiType,
  ExamplesForType,
  ExampleFailingMod,
} from "./utils.helper";

//
const ValidTypeCombinations = new Map<string, ExampleSucceedingMod>(
  Object.entries({
    cetWithRedsAndArchivesCanonical: {
      expectedInstallerType: InstallerType.MultiType,
      inFiles: [
        ...CET_PREFIXES,
        path.join(`${CET_PREFIX}/exmod/`),
        path.join(`${CET_PREFIX}/exmod/Modules/`),
        path.join(`${CET_PREFIX}/exmod/Modules/morelua.lua`),
        path.join(`${CET_PREFIX}/exmod/${CET_INIT}`),
        ...REDS_PREFIXES,
        path.join(`${REDS_PREFIX}/rexmod/`),
        path.join(`${REDS_PREFIX}/rexmod/script.reds`),
        path.join(`${REDS_PREFIX}/rexmod/notascript.reds`),
        ...ARCHIVE_PREFIXES,
        path.join(`${ARCHIVE_PREFIX}/magicgoeshere.archive`),
      ],
      outInstructions: [
        copiedToSamePath(`${CET_PREFIX}/exmod/${CET_INIT}`),
        copiedToSamePath(`${CET_PREFIX}/exmod/Modules/morelua.lua`),
        copiedToSamePath(`${REDS_PREFIX}/rexmod/script.reds`),
        copiedToSamePath(`${REDS_PREFIX}/rexmod/notascript.reds`),
        copiedToSamePath(`${ARCHIVE_PREFIX}/magicgoeshere.archive`),
      ],
    },
    // We should probably add some kind of a reference to
    // mods that are structured this way if they exist.
    cetWithRedsAtRedsRootFixableUsesSyntheticModName: {
      expectedInstallerType: InstallerType.MultiType,
      inFiles: [
        ...CET_PREFIXES,
        path.join(`${CET_PREFIX}/exmod/`),
        path.join(`${CET_PREFIX}/exmod/Modules/`),
        path.join(`${CET_PREFIX}/exmod/Modules/morelua.lua`),
        path.join(`${CET_PREFIX}/exmod/${CET_INIT}`),
        ...REDS_PREFIXES,
        path.join(`${REDS_PREFIX}/`),
        path.join(`${REDS_PREFIX}/script.reds`),
        ...ARCHIVE_PREFIXES,
        path.join(`${ARCHIVE_PREFIX}/magicgoeshere.archive`),
      ],
      outInstructions: [
        copiedToSamePath(`${CET_PREFIX}/exmod/${CET_INIT}`),
        copiedToSamePath(`${CET_PREFIX}/exmod/Modules/morelua.lua`),
        {
          type: `copy`,
          source: path.join(`${REDS_PREFIX}/script.reds`),
          destination: path.join(`${REDS_PREFIX}/${FAKE_MOD_NAME}/script.reds`),
        },
        copiedToSamePath(`${ARCHIVE_PREFIX}/magicgoeshere.archive`),
      ],
    },
    multiTypeCetRedscriptRed4ExtCanonical: {
      // Mod example: Furigana
      expectedInstallerType: InstallerType.MultiType,
      inFiles: [
        ...CET_PREFIXES,
        path.join(`${CET_PREFIX}/exmod/`),
        path.join(`${CET_PREFIX}/exmod/Modules/`),
        path.join(`${CET_PREFIX}/exmod/Modules/morelua.lua`),
        path.join(`${CET_PREFIX}/exmod/${CET_INIT}`),
        ...REDS_PREFIXES,
        path.join(`${REDS_PREFIX}/rexmod/script.reds`),
        ...RED4EXT_PREFIXES,
        path.join(`${RED4EXT_PREFIX}/r4xmod/`),
        path.join(`${RED4EXT_PREFIX}/r4xmod/script.dll`),
        path.join(`${RED4EXT_PREFIX}/r4xmod/sme.ini`),
        path.join(`${RED4EXT_PREFIX}/r4xmod/sub/`),
        path.join(`${RED4EXT_PREFIX}/r4xmod/sub/subscript.dll`),
        ...ARCHIVE_PREFIXES,
        path.join(`${ARCHIVE_PREFIX}/magicgoeshere.archive`),
      ],
      outInstructions: [
        copiedToSamePath(`${CET_PREFIX}/exmod/${CET_INIT}`),
        copiedToSamePath(`${CET_PREFIX}/exmod/Modules/morelua.lua`),
        copiedToSamePath(`${REDS_PREFIX}/rexmod/script.reds`),
        copiedToSamePath(`${RED4EXT_PREFIX}/r4xmod/script.dll`),
        copiedToSamePath(`${RED4EXT_PREFIX}/r4xmod/sme.ini`),
        copiedToSamePath(`${RED4EXT_PREFIX}/r4xmod/sub/subscript.dll`),
        copiedToSamePath(`${ARCHIVE_PREFIX}/magicgoeshere.archive`),
      ],
    },
    "MultiType: CET + Reds + Archive (Canonical), Red4Ext basedir, FIXABLE [Example mod: Furigana]":
      {
        expectedInstallerType: InstallerType.MultiType,
        inFiles: [
          ...CET_PREFIXES,
          path.join(`${CET_PREFIX}/exmod/`),
          path.join(`${CET_PREFIX}/exmod/Modules/`),
          path.join(`${CET_PREFIX}/exmod/Modules/morelua.lua`),
          path.join(`${CET_PREFIX}/exmod/${CET_INIT}`),
          ...REDS_PREFIXES,
          path.join(`${REDS_PREFIX}/rexmod/script.reds`),
          ...RED4EXT_PREFIXES,
          path.join(`${RED4EXT_PREFIX}/script.dll`),
          ...ARCHIVE_PREFIXES,
          path.join(`${ARCHIVE_PREFIX}/magicgoeshere.archive`),
        ],
        outInstructions: [
          copiedToSamePath(`${CET_PREFIX}/exmod/${CET_INIT}`),
          copiedToSamePath(`${CET_PREFIX}/exmod/Modules/morelua.lua`),
          copiedToSamePath(`${REDS_PREFIX}/rexmod/script.reds`),
          {
            type: `copy`,
            source: path.join(`${RED4EXT_PREFIX}/script.dll`),
            destination: path.join(`${RED4EXT_PREFIX}/${FAKE_MOD_NAME}/script.dll`),
          },
          copiedToSamePath(`${ARCHIVE_PREFIX}/magicgoeshere.archive`),
        ],
      },
    "MultiType: CET, Redscript, TweakXL, Archive Canonical + Basedir Red4Ext": {
      expectedInstallerType: InstallerType.MultiType,
      inFiles: [
        ...CET_PREFIXES,
        path.join(`${CET_PREFIX}/exmod/`),
        path.join(`${CET_PREFIX}/exmod/Modules/`),
        path.join(`${CET_PREFIX}/exmod/Modules/morelua.lua`),
        path.join(`${CET_PREFIX}/exmod/${CET_INIT}`),
        ...REDS_PREFIXES,
        path.join(`${REDS_PREFIX}/rexmod/script.reds`),
        ...TWEAK_XL_PATHS,
        path.join(`${TWEAK_XL_PATH}\\tw\\mytweak.yaml`),
        ...RED4EXT_PREFIXES,
        path.join(`${RED4EXT_PREFIX}/script.dll`),
        ...ARCHIVE_PREFIXES,
        path.join(`${ARCHIVE_PREFIX}/magicgoeshere.archive`),
      ],
      outInstructions: [
        copiedToSamePath(`${CET_PREFIX}/exmod/${CET_INIT}`),
        copiedToSamePath(`${CET_PREFIX}/exmod/Modules/morelua.lua`),
        copiedToSamePath(`${REDS_PREFIX}/rexmod/script.reds`),
        {
          type: `copy`,
          source: path.join(`${RED4EXT_PREFIX}/script.dll`),
          destination: path.join(`${RED4EXT_PREFIX}/${FAKE_MOD_NAME}/script.dll`),
        },
        copiedToSamePath(`${ARCHIVE_PREFIX}/magicgoeshere.archive`),
        copiedToSamePath(`${TWEAK_XL_PATH}\\tw\\mytweak.yaml`),
      ],
    },
    "MultiType: CET, Redscript, TweakXL, ArchiveXL Canonical + Basedir Red4Ext": {
      expectedInstallerType: InstallerType.MultiType,
      inFiles: [
        ...CET_PREFIXES,
        path.join(`${CET_PREFIX}/exmod/`),
        path.join(`${CET_PREFIX}/exmod/Modules/`),
        path.join(`${CET_PREFIX}/exmod/Modules/morelua.lua`),
        path.join(`${CET_PREFIX}/exmod/${CET_INIT}`),
        ...REDS_PREFIXES,
        path.join(`${REDS_PREFIX}/rexmod/script.reds`),
        ...TWEAK_XL_PATHS,
        path.join(`${TWEAK_XL_PATH}\\tw\\mytweak.yaml`),
        ...RED4EXT_PREFIXES,
        path.join(`${RED4EXT_PREFIX}/script.dll`),
        ...ARCHIVE_PREFIXES,
        path.join(`${ARCHIVE_PREFIX}/magicgoeshere.xl`),
        path.join(`${ARCHIVE_PREFIX}/magicgoeshere.archive`),
      ],
      outInstructions: [
        copiedToSamePath(`${CET_PREFIX}/exmod/${CET_INIT}`),
        copiedToSamePath(`${CET_PREFIX}/exmod/Modules/morelua.lua`),
        copiedToSamePath(`${REDS_PREFIX}/rexmod/script.reds`),
        {
          type: `copy`,
          source: path.join(`${RED4EXT_PREFIX}/script.dll`),
          destination: path.join(`${RED4EXT_PREFIX}/${FAKE_MOD_NAME}/script.dll`),
        },
        copiedToSamePath(`${ARCHIVE_PREFIX}/magicgoeshere.xl`),
        copiedToSamePath(`${ARCHIVE_PREFIX}/magicgoeshere.archive`),
        copiedToSamePath(`${TWEAK_XL_PATH}\\tw\\mytweak.yaml`),
      ],
    },
    "MultiType: CET, Redscript, TweakXL, ArchiveXL only Canonical + Basedir Red4Ext": {
      expectedInstallerType: InstallerType.MultiType,
      inFiles: [
        ...CET_PREFIXES,
        path.join(`${CET_PREFIX}/exmod/`),
        path.join(`${CET_PREFIX}/exmod/Modules/`),
        path.join(`${CET_PREFIX}/exmod/Modules/morelua.lua`),
        path.join(`${CET_PREFIX}/exmod/${CET_INIT}`),
        ...REDS_PREFIXES,
        path.join(`${REDS_PREFIX}/rexmod/script.reds`),
        ...TWEAK_XL_PATHS,
        path.join(`${TWEAK_XL_PATH}\\tw\\mytweak.yaml`),
        ...RED4EXT_PREFIXES,
        path.join(`${RED4EXT_PREFIX}/script.dll`),
        ...ARCHIVE_PREFIXES,
        path.join(`${ARCHIVE_PREFIX}/magicgoeshere.xl`),
      ],
      outInstructions: [
        copiedToSamePath(`${CET_PREFIX}/exmod/${CET_INIT}`),
        copiedToSamePath(`${CET_PREFIX}/exmod/Modules/morelua.lua`),
        copiedToSamePath(`${REDS_PREFIX}/rexmod/script.reds`),
        {
          type: `copy`,
          source: path.join(`${RED4EXT_PREFIX}/script.dll`),
          destination: path.join(`${RED4EXT_PREFIX}/${FAKE_MOD_NAME}/script.dll`),
        },
        copiedToSamePath(`${ARCHIVE_PREFIX}/magicgoeshere.xl`),
        copiedToSamePath(`${TWEAK_XL_PATH}\\tw\\mytweak.yaml`),
      ],
    },
    "MultiType: TweakXL + Archive Canonical": {
      expectedInstallerType: InstallerType.MultiType,
      inFiles: [
        ...TWEAK_XL_PATHS,
        path.join(`${TWEAK_XL_PATH}\\tw\\mytweak.yaml`),
        ...ARCHIVE_PREFIXES,
        path.join(`${ARCHIVE_PREFIX}/magicgoeshere.archive`),
        path.join(`${ARCHIVE_PREFIX}/magicgoeshere.xl`),
      ],
      outInstructions: [
        copiedToSamePath(`${ARCHIVE_PREFIX}/magicgoeshere.xl`),
        copiedToSamePath(`${ARCHIVE_PREFIX}/magicgoeshere.archive`),
        copiedToSamePath(`${TWEAK_XL_PATH}\\tw\\mytweak.yaml`),
      ],
    },
    "MultiType: Red4ext + Archive Canonical": {
      expectedInstallerType: InstallerType.MultiType,
      inFiles: [
        ...RED4EXT_PREFIXES,
        path.join(`${RED4EXT_PREFIX}/r4xmod/script.dll`),
        ...ARCHIVE_PREFIXES,
        path.join(`${ARCHIVE_PREFIX}/magicgoeshere.archive`),
        path.join(`${ARCHIVE_PREFIX}/magicgoeshere.xl`),
      ],
      outInstructions: [
        copiedToSamePath(`${RED4EXT_PREFIX}/r4xmod/script.dll`),
        copiedToSamePath(`${ARCHIVE_PREFIX}/magicgoeshere.xl`),
        copiedToSamePath(`${ARCHIVE_PREFIX}/magicgoeshere.archive`),
      ],
    },
    "MultiType: Red4ext + TweakXL Canonical": {
      expectedInstallerType: InstallerType.MultiType,
      inFiles: [
        ...RED4EXT_PREFIXES,
        path.join(`${RED4EXT_PREFIX}/r4xmod/script.dll`),
        ...TWEAK_XL_PATHS,
        path.join(`${TWEAK_XL_PATH}\\tw\\mytweak.yaml`),
      ],
      outInstructions: [
        copiedToSamePath(`${RED4EXT_PREFIX}/r4xmod/script.dll`),
        copiedToSamePath(`${TWEAK_XL_PATH}\\tw\\mytweak.yaml`),
      ],
    },
  }),
);

const MultiTypeModShouldPromptForInstall = new Map<string, ExamplePromptInstallableMod>(
  Object.entries({
    "MultiType: XML Config should prompt, w/ CET, Reds, Red4ext, Archive + XL, TweakXL, JSON":
      {
        expectedInstallerType: InstallerType.MultiType,
        proceedLabel: InstallChoices.Proceed,
        inFiles: [
          ...CET_PREFIXES,
          path.join(`${CET_PREFIX}/exmod/`),
          path.join(`${CET_PREFIX}/exmod/Modules/`),
          path.join(`${CET_PREFIX}/exmod/Modules/morelua.lua`),
          path.join(`${CET_PREFIX}/exmod/${CET_INIT}`),
          ...REDS_PREFIXES,
          path.join(`${REDS_PREFIX}/rexmod/script.reds`),
          ...XML_PREFIXES,
          path.join(`${CONFIG_XML_MOD_BASEDIR}\\inputUserMappings.xml`),
          path.join(`${CONFIG_JSON_MOD_BASEDIR_SETTINGS}\\options.json`),
          ...RED4EXT_PREFIXES,
          path.join(`${RED4EXT_PREFIX}/r4xmod/`),
          path.join(`${RED4EXT_PREFIX}/r4xmod/script.dll`),
          path.join(`${RED4EXT_PREFIX}/r4xmod/sme.ini`),
          path.join(`${RED4EXT_PREFIX}/r4xmod/sub/`),
          path.join(`${RED4EXT_PREFIX}/r4xmod/sub/subscript.dll`),
          ...TWEAK_XL_PATHS,
          path.join(`${TWEAK_XL_PATH}\\tw\\mytweak.yaml`),
          ...ARCHIVE_PREFIXES,
          path.join(`${ARCHIVE_PREFIX}/magicgoeshere.archive`),
          path.join(`${ARCHIVE_PREFIX}/magicgoeshere.xl`),
        ],
        proceedOutInstructions: [
          copiedToSamePath(`${CET_PREFIX}/exmod/${CET_INIT}`),
          copiedToSamePath(`${CET_PREFIX}/exmod/Modules/morelua.lua`),
          copiedToSamePath(`${REDS_PREFIX}/rexmod/script.reds`),
          copiedToSamePath(`${CONFIG_XML_MOD_BASEDIR}\\inputUserMappings.xml`),
          copiedToSamePath(`${CONFIG_JSON_MOD_BASEDIR_SETTINGS}\\options.json`),
          copiedToSamePath(`${TWEAK_XL_PATH}\\tw\\mytweak.yaml`),
          copiedToSamePath(`${RED4EXT_PREFIX}/r4xmod/script.dll`),
          copiedToSamePath(`${RED4EXT_PREFIX}/r4xmod/sme.ini`),
          copiedToSamePath(`${RED4EXT_PREFIX}/r4xmod/sub/subscript.dll`),
          copiedToSamePath(`${ARCHIVE_PREFIX}/magicgoeshere.archive`),
          copiedToSamePath(`${ARCHIVE_PREFIX}/magicgoeshere.xl`),
        ],
        cancelLabel: InstallChoices.Cancel,
        cancelErrorMessage: expectedUserCancelProtectedMessageInMultiType,
      },
    multitypeWithArchivesAtToplevelPromptsOnConflict: {
      expectedInstallerType: InstallerType.MultiType,
      proceedLabel: InstallChoices.Proceed,
      inFiles: [
        ...CET_PREFIXES,
        path.join(`${CET_PREFIX}/exmod/`),
        path.join(`${CET_PREFIX}/exmod/Modules/`),
        path.join(`${CET_PREFIX}/exmod/Modules/morelua.lua`),
        path.join(`${CET_PREFIX}/exmod/${CET_INIT}`),
        ...REDS_PREFIXES,
        path.join(`${REDS_PREFIX}/rexmod/script.reds`),
        ...RED4EXT_PREFIXES,
        path.join(`${RED4EXT_PREFIX}/r4xmod/`),
        path.join(`${RED4EXT_PREFIX}/r4xmod/script.dll`),
        path.join(`${RED4EXT_PREFIX}/r4xmod/sme.ini`),
        path.join(`${RED4EXT_PREFIX}/r4xmod/sub/`),
        path.join(`${RED4EXT_PREFIX}/r4xmod/sub/subscript.dll`),
        ...ARCHIVE_PREFIXES,
        path.join(`magicgoeselsewhere.archive`),
      ],
      proceedOutInstructions: [
        copiedToSamePath(`${CET_PREFIX}/exmod/${CET_INIT}`),
        copiedToSamePath(`${CET_PREFIX}/exmod/Modules/morelua.lua`),
        copiedToSamePath(`${REDS_PREFIX}/rexmod/script.reds`),
        copiedToSamePath(`${RED4EXT_PREFIX}/r4xmod/script.dll`),
        copiedToSamePath(`${RED4EXT_PREFIX}/r4xmod/sme.ini`),
        copiedToSamePath(`${RED4EXT_PREFIX}/r4xmod/sub/subscript.dll`),
        copiedToSamePath(`magicgoeselsewhere.archive`),
      ],
      cancelLabel: InstallChoices.Cancel,
      cancelErrorMessage: expectedUserCancelMessageFor(InstallerType.MultiType),
    },
    multitypeWithCanonAndToplevelRedsPromptsOnConflict: {
      expectedInstallerType: InstallerType.MultiType,
      proceedLabel: InstallChoices.Proceed,
      inFiles: [
        ...CET_PREFIXES,
        path.join(`${CET_PREFIX}/exmod/`),
        path.join(`${CET_PREFIX}/exmod/Modules/`),
        path.join(`${CET_PREFIX}/exmod/Modules/morelua.lua`),
        path.join(`${CET_PREFIX}/exmod/${CET_INIT}`),
        ...REDS_PREFIXES,
        path.join(`topsies.reds`),
        path.join(`${REDS_PREFIX}/rexmod/script.reds`),
        ...RED4EXT_PREFIXES,
        path.join(`${RED4EXT_PREFIX}/r4xmod/`),
        path.join(`${RED4EXT_PREFIX}/r4xmod/script.dll`),
        path.join(`${RED4EXT_PREFIX}/r4xmod/sme.ini`),
        path.join(`${RED4EXT_PREFIX}/r4xmod/sub/`),
        path.join(`${RED4EXT_PREFIX}/r4xmod/sub/subscript.dll`),
        ...ARCHIVE_PREFIXES,
        path.join(`${ARCHIVE_PREFIX}\\magicgoeshere.archive`),
      ],
      proceedOutInstructions: [
        copiedToSamePath(`${CET_PREFIX}/exmod/${CET_INIT}`),
        copiedToSamePath(`${CET_PREFIX}/exmod/Modules/morelua.lua`),
        copiedToSamePath(`topsies.reds`),
        copiedToSamePath(`${REDS_PREFIX}/rexmod/script.reds`),
        copiedToSamePath(`${RED4EXT_PREFIX}/r4xmod/script.dll`),
        copiedToSamePath(`${RED4EXT_PREFIX}/r4xmod/sme.ini`),
        copiedToSamePath(`${RED4EXT_PREFIX}/r4xmod/sub/subscript.dll`),
        copiedToSamePath(`${ARCHIVE_PREFIX}\\magicgoeshere.archive`),
      ],
      cancelLabel: InstallChoices.Cancel,
      cancelErrorMessage: expectedUserCancelMessageFor(InstallerType.MultiType),
    },
  }),
);

const examples: ExamplesForType = {
  AllExpectedSuccesses: ValidTypeCombinations,
  AllExpectedDirectFailures: new Map<string, ExampleFailingMod>(),
  AllExpectedPromptInstalls: MultiTypeModShouldPromptForInstall,
};

export default examples;
