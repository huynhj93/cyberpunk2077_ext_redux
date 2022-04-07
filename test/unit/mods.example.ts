import path from "path";
import { copiedToSamePath, createdDirectory, pathHierarchyFor } from "./utils.helper";

import { EXTENSION_NAME_INTERNAL } from "../../src/index.metadata";

import {
  CET_MOD_CANONICAL_INIT_FILE,
  CET_MOD_CANONICAL_PATH_PREFIX,
  REDS_MOD_CANONICAL_PATH_PREFIX,
  RED4EXT_MOD_CANONICAL_BASEDIR,
  AMM_MOD_PREFIX,
  ARCHIVE_MOD_CANONICAL_PREFIX,
  ARCHIVE_MOD_TRADITIONAL_WRONG_PREFIX,
  CONFIG_INI_MOD_BASEDIR,
  CONFIG_RESHADE_MOD_BASEDIR,
  CONFIG_RESHADE_MOD_SHADER_BASEDIR,
  ASI_MOD_PATH,
  RED4EXT_KNOWN_NONOVERRIDABLE_DLL_DIRS,
  RED4EXT_KNOWN_NONOVERRIDABLE_DLLS,
  TWEAK_XL_MOD_CANONICAL_PATH_PREFIX,
  CONFIG_XML_MOD_PROTECTED_FILES,
  CONFIG_XML_MOD_BASEDIR,
  CONFIG_JSON_MOD_PROTECTED_FILES,
  CONFIG_JSON_MOD_BASEDIR_SETTINGS,
  CONFIG_XML_MOD_PROTECTED_FILENAMES,
} from "../../src/installers.layouts";
import { VortexInstruction } from "../../src/vortex-wrapper";
import { InstallChoices } from "../../src/dialogs";
import { InstallerType } from "../../src/installers.types";

export type InFiles = string[];

interface ExampleMod {
  expectedInstallerType: InstallerType;
  inFiles: InFiles;
}
export interface ExampleSucceedingMod extends ExampleMod {
  outInstructions: VortexInstruction[];
}

export interface ExampleFailingMod extends ExampleMod {
  failure: string;
  errorDialogTitle: string;
}

export interface ExamplePromptInstallableMod extends ExampleMod {
  proceedLabel: string;
  proceedOutInstructions: VortexInstruction[];
  cancelLabel: string;
  cancelErrorMessage: string;
}

// Really should probably make this a sensible type but w/e
export type ExampleModCategory = Map<string, ExampleSucceedingMod>;
export type ExampleFailingModCategory = Map<string, ExampleFailingMod>;
export type ExamplePromptInstallableModCategory = Map<
  string,
  ExamplePromptInstallableMod
>;

export const FAKE_STAGING_ZIPFILE = path.normalize("vortexusesthezipfileasdir-3429 4");
export const FAKE_STAGING_PATH = path.join(
  "unno",
  "why",
  "this",
  FAKE_STAGING_ZIPFILE,
  path.sep,
);
export const FAKE_MOD_NAME = `${EXTENSION_NAME_INTERNAL}-${FAKE_STAGING_ZIPFILE}`;

const CORE_CET_FULL_PATH_DEPTH = path.normalize(
  "bin/x64/plugins/cyber_engine_tweaks/scripts/json",
);
const CORE_CET_PREFIXES = pathHierarchyFor(CORE_CET_FULL_PATH_DEPTH);
const GAME_DIR = path.normalize("bin/x64");

const XML_PREFIXES = pathHierarchyFor(CONFIG_XML_MOD_BASEDIR);

const CET_PREFIX = CET_MOD_CANONICAL_PATH_PREFIX;
const CET_PREFIXES = pathHierarchyFor(CET_PREFIX);
const CET_INIT = CET_MOD_CANONICAL_INIT_FILE;

const REDS_PREFIX = REDS_MOD_CANONICAL_PATH_PREFIX;
const REDS_PREFIXES = pathHierarchyFor(REDS_PREFIX);

const RED4EXT_PREFIX = RED4EXT_MOD_CANONICAL_BASEDIR;
const RED4EXT_PREFIXES = pathHierarchyFor(RED4EXT_PREFIX);

const TWEAK_XL_PATH = TWEAK_XL_MOD_CANONICAL_PATH_PREFIX;
const TWEAK_XL_PATHS = pathHierarchyFor(TWEAK_XL_PATH);

const ARCHIVE_PREFIX = ARCHIVE_MOD_CANONICAL_PREFIX;
const ARCHIVE_PREFIXES = pathHierarchyFor(ARCHIVE_PREFIX);

const ASI_PREFIX = ASI_MOD_PATH;
const ASI_PREFIXES = pathHierarchyFor(ASI_PREFIX);

const GIFTWRAP_PREFIX = `some-dirname`;
const CET_GIFTWRAPS = pathHierarchyFor(`${GIFTWRAP_PREFIX}\\${CET_PREFIX}`);
const REDS_GIFTWRAPS = pathHierarchyFor(`${GIFTWRAP_PREFIX}\\${REDS_PREFIX}`);
const RED4EXT_GIFTWRAPS = pathHierarchyFor(`${GIFTWRAP_PREFIX}\\${RED4EXT_PREFIX}`);
const ARCHIVE_GIFTWRAPS = pathHierarchyFor(`${GIFTWRAP_PREFIX}\\${ARCHIVE_PREFIX}`);

/*
 * Let's see about maybe enabling these later
 *
// Some loggy helpers

const PIPELINE_LOG = `${InstallerType.Pipeline}: installation error: `;
*/

const expectedUserCancelMessageFor = (installerType: InstallerType) =>
  `${installerType}: user chose to cancel installation`;

const expectedUserCancelProtectedMessageFor = (installerType: InstallerType) =>
  `${installerType}: user chose to cancel installing to protected paths`;

const expectedUserCancelProtectedMessageInMultiType = `${InstallerType.MultiType}: user has canceled installation for some part of this mod. Can't proceed safely, canceling entirely.`;

const CoreCetInstall = new Map<string, ExampleSucceedingMod>(
  Object.entries({
    coreCetInstall: {
      expectedInstallerType: InstallerType.CoreCET,
      inFiles: [
        ...CORE_CET_PREFIXES,
        path.join(`${GAME_DIR}/global.ini`),
        path.join(`${GAME_DIR}/LICENSE`),
        path.join(`${GAME_DIR}/version.dll`),
        path.join(`${GAME_DIR}/plugins/cyber_engine_tweaks.asi`),
        path.join(`${GAME_DIR}/plugins/cyber_engine_tweaks/ThirdParty_LICENSES`),
        path.join(`${GAME_DIR}/plugins/cyber_engine_tweaks/scripts/autoexec.lua`),
        path.join(`${CORE_CET_FULL_PATH_DEPTH}/json.lua`),
        path.join(`${CORE_CET_FULL_PATH_DEPTH}/LICENSE`),
        path.join(`${CORE_CET_FULL_PATH_DEPTH}/README.md`),
      ].map(path.normalize),
      outInstructions: [
        {
          type: "copy",
          source: path.join(`${GAME_DIR}/global.ini`),
          destination: path.join(`${GAME_DIR}/global.ini`),
        },
        {
          type: "copy",
          source: path.join(`${GAME_DIR}/LICENSE`),
          destination: path.join(`${GAME_DIR}/LICENSE`),
        },
        {
          type: "copy",
          source: path.join(`${GAME_DIR}/version.dll`),
          destination: path.join(`${GAME_DIR}/version.dll`),
        },
        {
          type: "copy",
          source: path.join(`${GAME_DIR}/plugins/cyber_engine_tweaks.asi`),
          destination: path.join(`${GAME_DIR}/plugins/cyber_engine_tweaks.asi`),
        },
        {
          type: "copy",
          source: path.join(
            `${GAME_DIR}/plugins/cyber_engine_tweaks/ThirdParty_LICENSES`,
          ),
          destination: path.join(
            `${GAME_DIR}/plugins/cyber_engine_tweaks/ThirdParty_LICENSES`,
          ),
        },
        {
          type: "copy",
          source: path.join(
            `${GAME_DIR}/plugins/cyber_engine_tweaks/scripts/autoexec.lua`,
          ),
          destination: path.join(
            `${GAME_DIR}/plugins/cyber_engine_tweaks/scripts/autoexec.lua`,
          ),
        },
        {
          type: "copy",
          source: path.join(`${CORE_CET_FULL_PATH_DEPTH}/json.lua`),
          destination: path.join(`${CORE_CET_FULL_PATH_DEPTH}/json.lua`),
        },
        {
          type: "copy",
          source: path.join(`${CORE_CET_FULL_PATH_DEPTH}/LICENSE`),
          destination: path.join(`${CORE_CET_FULL_PATH_DEPTH}/LICENSE`),
        },
        {
          type: "copy",
          source: path.join(`${CORE_CET_FULL_PATH_DEPTH}/README.md`),
          destination: path.join(`${CORE_CET_FULL_PATH_DEPTH}/README.md`),
        },
      ],
    },
  }),
);

const CoreRedscriptInstall = new Map<string, ExampleSucceedingMod>(
  Object.entries({
    coreRedscriptInstall: {
      expectedInstallerType: InstallerType.CoreRedscript,
      inFiles: [
        path.join("engine/"),
        path.join("engine/config/"),
        path.join("engine/config/base/"),
        path.join("engine/config/base/scripts.ini"),
        path.join("engine/tools/"),
        path.join("engine/tools/scc.exe"),
        path.join("r6/"),
        path.join("r6/scripts/"),
        path.join("r6/scripts/redscript.toml"),
      ].map(path.normalize),
      outInstructions: [
        {
          type: "copy",
          source: path.join("engine/config/base/scripts.ini"),
          destination: path.join("engine/config/base/scripts.ini"),
        },
        {
          type: "copy",
          source: path.join("engine/tools/scc.exe"),
          destination: path.join("engine/tools/scc.exe"),
        },
        {
          type: "copy",
          source: path.join("r6/scripts/redscript.toml"),
          destination: path.join("r6/scripts/redscript.toml"),
        },
      ],
    },
  }),
);

const CoreTweakXLInstall = new Map<string, ExampleSucceedingMod>(
  Object.entries({
    coreTweakXLInstallCanon: {
      expectedInstallerType: InstallerType.CoreTweakXL,
      inFiles: [
        path.join(`r6\\`),
        path.join(`red4ext\\`),
        path.join(`r6\\scripts\\`),
        path.join(`r6\\scripts\\TweakXL\\`),
        path.join(`r6\\scripts\\TweakXL\\TweakXL.reds`),
        path.join(`r6\\tweaks\\`),
        path.join(`red4ext\\plugins\\`),
        path.join(`red4ext\\plugins\\TweakXL\\`),
        path.join(`red4ext\\plugins\\TweakXL\\TweakXL.dll`),
      ],
      outInstructions: [
        createdDirectory(`r6\\tweaks\\`), // This is a special case
        copiedToSamePath(`r6\\scripts\\TweakXL\\TweakXL.reds`),
        copiedToSamePath(`red4ext\\plugins\\TweakXL\\TweakXL.dll`),
      ],
    },
  }),
);

const CoreTweakXLShouldFailOnInstallIfNotExactLayout = new Map<string, ExampleFailingMod>(
  Object.entries({
    coreTweakXLWithExtraFiles: {
      expectedInstallerType: InstallerType.CoreTweakXL,
      inFiles: [
        path.join(`r6\\`),
        path.join(`red4ext\\`),
        path.join(`r6\\scripts\\`),
        path.join(`r6\\scripts\\TweakXL\\`),
        path.join(`r6\\scripts\\TweakXL\\TweakXL.reds`),
        path.join(`r6\\tweaks\\`),
        path.join(`red4ext\\plugins\\`),
        path.join(`red4ext\\plugins\\TweakXL\\`),
        path.join(`red4ext\\plugins\\TweakXL\\TweakXL.dll`),
        path.join(`archive\\pc\\mod\\tweakarchive.archive`),
      ],
      failure: `Didn't Find Expected TweakXL Installation!`,
      errorDialogTitle: `Didn't Find Expected TweakXL Installation!`,
    },
    coreTweakXLWithMissingFiles: {
      expectedInstallerType: InstallerType.CoreTweakXL,
      inFiles: [
        path.join(`r6\\`),
        path.join(`red4ext\\`),
        path.join(`r6\\scripts\\`),
        path.join(`r6\\scripts\\TweakXL\\`),
        path.join(`r6\\scripts\\TweakXL\\TweakXL.reds`),
        path.join(`r6\\tweaks\\`),
        path.join(`red4ext\\plugins\\`),
        path.join(`red4ext\\plugins\\TweakXL\\`),
      ],
      failure: `Didn't Find Expected TweakXL Installation!`,
      errorDialogTitle: `Didn't Find Expected TweakXL Installation!`,
    },
  }),
);

const TweakXLMod = new Map<string, ExampleSucceedingMod>(
  Object.entries({
    tweakXLWithFilesInCanonicalDir: {
      expectedInstallerType: InstallerType.TweakXL,
      inFiles: [
        ...TWEAK_XL_PATHS,
        path.join(`${TWEAK_XL_PATH}\\mytweak.yaml`),
        path.join(`${TWEAK_XL_PATH}\\myothertweak.yml`),
      ],
      outInstructions: [
        copiedToSamePath(`${TWEAK_XL_PATH}\\mytweak.yaml`),
        copiedToSamePath(`${TWEAK_XL_PATH}\\myothertweak.yml`),
      ],
    },
    tweakXLWithFilesInSubdirsCanonical: {
      expectedInstallerType: InstallerType.TweakXL,
      inFiles: [
        ...TWEAK_XL_PATHS,
        path.join(`${TWEAK_XL_PATH}\\sub1\\mytweak.yaml`),
        path.join(`${TWEAK_XL_PATH}\\sub2\\myothertweak.yml`),
        path.join(`${TWEAK_XL_PATH}\\sub3\\sub4\\mythirdtweak.yml`),
      ],
      outInstructions: [
        copiedToSamePath(`${TWEAK_XL_PATH}\\sub1\\mytweak.yaml`),
        copiedToSamePath(`${TWEAK_XL_PATH}\\sub2\\myothertweak.yml`),
        copiedToSamePath(`${TWEAK_XL_PATH}\\sub3\\sub4\\mythirdtweak.yml`),
      ],
    },
    tweakXLWithFilesInBasedirAndSubdirsCanonical: {
      expectedInstallerType: InstallerType.TweakXL,
      inFiles: [
        ...TWEAK_XL_PATHS,
        path.join(`${TWEAK_XL_PATH}\\mytweak.yaml`),
        path.join(`${TWEAK_XL_PATH}\\sub2\\myothertweak.yml`),
      ],
      outInstructions: [
        copiedToSamePath(`${TWEAK_XL_PATH}\\mytweak.yaml`),
        copiedToSamePath(`${TWEAK_XL_PATH}\\sub2\\myothertweak.yml`),
      ],
    },
  }),
);

const TweakXLModShouldPromptForInstall = new Map<string, ExamplePromptInstallableMod>(
  Object.entries({
    tweakXLWithFileAtToplevelPromptsToInstallThroughFallback: {
      expectedInstallerType: InstallerType.TweakXL,
      inFiles: [path.join(`mytweak.yaml`)],
      proceedLabel: InstallChoices.Proceed,
      proceedOutInstructions: [copiedToSamePath(`mytweak.yaml`)],
      cancelLabel: InstallChoices.Cancel,
      cancelErrorMessage: expectedUserCancelMessageFor(InstallerType.Fallback),
    },
    tweakXLWithIncorrectFileExtensionPromptsToInstallDirectly: {
      expectedInstallerType: InstallerType.TweakXL,
      inFiles: [path.join(`${TWEAK_XL_PATH}\\mytweak.xml`)],
      proceedLabel: InstallChoices.Proceed,
      proceedOutInstructions: [copiedToSamePath(`${TWEAK_XL_PATH}\\mytweak.xml`)],
      cancelLabel: InstallChoices.Cancel,
      cancelErrorMessage: expectedUserCancelMessageFor(InstallerType.TweakXL),
    },
  }),
);

const CoreArchiveXLInstall = new Map<string, ExampleSucceedingMod>(
  Object.entries({
    coreArchiveXLInstallCanon: {
      expectedInstallerType: InstallerType.CoreArchiveXL,
      inFiles: [
        path.join(`red4ext\\`),
        path.join(`red4ext\\plugins\\`),
        path.join(`red4ext\\plugins\\ArchiveXL\\`),
        path.join(`red4ext\\plugins\\ArchiveXL\\ArchiveXL.dll`),
      ],
      outInstructions: [copiedToSamePath(`red4ext\\plugins\\ArchiveXL\\ArchiveXL.dll`)],
    },
  }),
);

const CoreArchiveXLShouldFailOnInstallIfNotExactLayout = new Map<
  string,
  ExampleFailingMod
>(
  Object.entries({
    coreArchiveXLWithExtraFiles: {
      expectedInstallerType: InstallerType.CoreArchiveXL,
      inFiles: [
        path.join(`red4ext\\`),
        path.join(`red4ext\\plugins\\`),
        path.join(`red4ext\\plugins\\ArchiveXL\\`),
        path.join(`red4ext\\plugins\\ArchiveXL\\ArchiveXL.dll`),
        path.join(`archive\\pc\\mod\\tweakarchive.archive`),
      ],
      failure: `Didn't Find Expected ArchiveXL Installation!`,
      errorDialogTitle: `Didn't Find Expected ArchiveXL Installation!`,
    },
  }),
);

const CoreRed4ExtInstall = new Map<string, ExampleSucceedingMod>(
  Object.entries({
    Red4ExtCoreInstallTest: {
      expectedInstallerType: InstallerType.CoreRed4ext,
      inFiles: [
        ...pathHierarchyFor(path.normalize("bin/x64")),
        path.normalize("bin/x64/powrprof.dll"),
        ...pathHierarchyFor(path.normalize("red4ext/plugins")),
        path.normalize("red4ext/LICENSE.txt"),
        path.normalize("red4ext/RED4ext.dll"),
      ].map(path.normalize),
      outInstructions: [
        {
          type: "copy",
          source: path.normalize("bin/x64/powrprof.dll"),
          destination: path.normalize("bin/x64/powrprof.dll"),
        },
        {
          type: "copy",
          source: path.normalize("red4ext/LICENSE.txt"),
          destination: path.normalize("red4ext/LICENSE.txt"),
        },
        {
          type: "copy",
          source: path.normalize("red4ext/RED4ext.dll"),
          destination: path.normalize("red4ext/RED4ext.dll"),
        },
        {
          type: "mkdir",
          destination: path.normalize("red4ext/plugins"),
        },
      ],
    },
  }),
);

const CoreCsvMergeInstall = new Map<string, ExampleSucceedingMod>(
  Object.entries({
    CoreCsvMergeCoreInstallTest: {
      expectedInstallerType: InstallerType.CoreCSVMerge,
      inFiles: [
        ...pathHierarchyFor(`${CET_MOD_CANONICAL_PATH_PREFIX}/CSVMerge_Code/`),
        `${CET_MOD_CANONICAL_PATH_PREFIX}/CSVMerge_Code/Cron.lua`,
        ...pathHierarchyFor("csvmerge/mods/Example_Mod_Folder"),
        ...pathHierarchyFor(
          path.normalize(
            "csvmerge/wolvenkitcli/mod/CSVMerge/base/gameplay/factories/mods",
          ),
        ),
        "csvmerge/CSVMerge.cmd",
        "csvmerge/CSVMerge_Tutorial_&_Readme.txt",
        "csvmerge/mods/prefix.txt",
        "csvmerge/mods/prefix_lua.txt",
        "csvmerge/mods/suffix.txt",
        "csvmerge/mods/suffix_lua.txt",
        "csvmerge/mods/Example_Mod_Folder/your .code file goes here",
        "csvmerge/mods/Example_Mod_Folder/your .item files go here",
        "csvmerge/wolvenkitcli/install wkit console here",
        "csvmerge/wolvenkitcli/mod/CSVMerge/base/gameplay/factories.csv",
        "csvmerge/wolvenkitcli/mod/CSVMerge/base/gameplay/factories/mods/mods.csv",
      ].map(path.normalize),
      outInstructions: [
        {
          type: "copy",
          source: path.normalize(
            `${CET_MOD_CANONICAL_PATH_PREFIX}/CSVMerge_Code/Cron.lua`,
          ),
          destination: path.normalize(
            `${CET_MOD_CANONICAL_PATH_PREFIX}/CSVMerge_Code/Cron.lua`,
          ),
        },
        {
          type: "copy",
          source: path.normalize("csvmerge/CSVMerge.cmd"),
          destination: path.normalize("csvmerge/CSVMerge.cmd"),
        },
        {
          type: "copy",
          source: path.normalize("csvmerge/CSVMerge_Tutorial_&_Readme.txt"),
          destination: path.normalize("csvmerge/CSVMerge_Tutorial_&_Readme.txt"),
        },
        {
          type: "copy",
          source: path.normalize("csvmerge/mods/prefix.txt"),
          destination: path.normalize("csvmerge/mods/prefix.txt"),
        },
        {
          type: "copy",
          source: path.normalize("csvmerge/mods/prefix_lua.txt"),
          destination: path.normalize("csvmerge/mods/prefix_lua.txt"),
        },
        {
          type: "copy",
          source: path.normalize("csvmerge/mods/suffix.txt"),
          destination: path.normalize("csvmerge/mods/suffix.txt"),
        },
        {
          type: "copy",
          source: path.normalize("csvmerge/mods/suffix_lua.txt"),
          destination: path.normalize("csvmerge/mods/suffix_lua.txt"),
        },
        {
          type: "copy",
          source: path.normalize(
            "csvmerge/mods/Example_Mod_Folder/your .code file goes here",
          ),
          destination: path.normalize(
            "csvmerge/mods/Example_Mod_Folder/your .code file goes here",
          ),
        },
        {
          type: "copy",
          source: path.normalize(
            "csvmerge/mods/Example_Mod_Folder/your .item files go here",
          ),
          destination: path.normalize(
            "csvmerge/mods/Example_Mod_Folder/your .item files go here",
          ),
        },
        {
          type: "copy",
          source: path.normalize("csvmerge/wolvenkitcli/install wkit console here"),
          destination: path.normalize("csvmerge/wolvenkitcli/install wkit console here"),
        },
        {
          type: "copy",
          source: path.normalize(
            "csvmerge/wolvenkitcli/mod/CSVMerge/base/gameplay/factories.csv",
          ),
          destination: path.normalize(
            "csvmerge/wolvenkitcli/mod/CSVMerge/base/gameplay/factories.csv",
          ),
        },
        {
          type: "copy",
          source: path.normalize(
            "csvmerge/wolvenkitcli/mod/CSVMerge/base/gameplay/factories/mods/mods.csv",
          ),
          destination: path.normalize(
            "csvmerge/wolvenkitcli/mod/CSVMerge/base/gameplay/factories/mods/mods.csv",
          ),
        },
      ],
    },
  }),
);

const CoreWolvenkitCliInstall = new Map<string, ExampleSucceedingMod>(
  Object.entries({
    CoreWolvenKitCliCoreInstallTest: {
      expectedInstallerType: InstallerType.CoreWolvenKit,
      inFiles: [
        "WolvenKit CLI/AsyncEnumerable.dll",
        "WolvenKit CLI/Microsoft.Data.Sqlite.dll",
        "WolvenKit CLI/WolvenKit.CLI.exe",
      ].map(path.normalize),
      outInstructions: [
        {
          type: "copy",
          source: path.normalize("WolvenKit CLI/AsyncEnumerable.dll"),
          destination: path.normalize("csvmerge/wolvenkitcli/AsyncEnumerable.dll"),
        },
        {
          type: "copy",
          source: path.normalize("WolvenKit CLI/Microsoft.Data.Sqlite.dll"),
          destination: path.normalize("csvmerge/wolvenkitcli/Microsoft.Data.Sqlite.dll"),
        },
        {
          type: "copy",
          source: path.normalize("WolvenKit CLI//WolvenKit.CLI.exe"),
          destination: path.normalize("csvmerge/wolvenkitcli//WolvenKit.CLI.exe"),
        },
      ],
    },
  }),
);

const CoreWolvenKitShouldFailInTest = new Map<string, ExampleFailingMod>(
  Object.entries({
    CoreWolvenKitDetectedDesktop: {
      expectedInstallerType: InstallerType.NotSupported,
      inFiles: ["WolvenKit Desktop/", "WolvenKit Desktop/WolvenKit.exe"].map(
        path.normalize,
      ),
      failure: "WolvenKit Desktop is not able to be installed with Vortex.",
      errorDialogTitle: `WolvenKit Desktop is not able to be installed with Vortex.`,
    },
  }),
);

const AsiMod = new Map<string, ExampleSucceedingMod>(
  Object.entries({
    asiModWithCet: {
      expectedInstallerType: InstallerType.ASI,
      inFiles: [
        ...ASI_PREFIXES,
        `${ASI_PREFIX}/DiscordRPCHelper.asi`,
        `${ASI_PREFIX}/discord_game_sdk.dll`,
        ...CET_PREFIXES,
        `${CET_PREFIX}/CP77 Discord RPC/`,
        `${CET_PREFIX}/CP77 Discord RPC/${CET_INIT}`,
        `${CET_PREFIX}/CP77 Discord RPC/GameUI.lua`,
      ].map(path.normalize),
      outInstructions: [
        {
          type: "copy",
          source: path.normalize(`${ASI_PREFIX}/DiscordRPCHelper.asi`),
          destination: path.normalize(`${ASI_PREFIX}/DiscordRPCHelper.asi`),
        },
        {
          type: "copy",
          source: path.normalize(`${ASI_PREFIX}/discord_game_sdk.dll`),
          destination: path.normalize(`${ASI_PREFIX}/discord_game_sdk.dll`),
        },
        {
          type: "copy",
          source: path.normalize(`${CET_PREFIX}/CP77 Discord RPC/${CET_INIT}`),
          destination: path.normalize(`${CET_PREFIX}/CP77 Discord RPC/${CET_INIT}`),
        },
        {
          type: "copy",
          source: path.normalize(`${CET_PREFIX}/CP77 Discord RPC/GameUI.lua`),
          destination: path.normalize(`${CET_PREFIX}/CP77 Discord RPC/GameUI.lua`),
        },
      ],
    },
    standardAsiMod: {
      expectedInstallerType: InstallerType.ASI,
      inFiles: [...ASI_PREFIXES, `${ASI_PREFIX}/normal.asi`].map(path.normalize),
      outInstructions: [
        {
          type: "copy",
          source: path.normalize(`${ASI_PREFIX}/normal.asi`),
          destination: path.normalize(`${ASI_PREFIX}/normal.asi`),
        },
      ],
    },
  }),
);

const CetMod = new Map<string, ExampleSucceedingMod>(
  Object.entries({
    cetWithOnlyInitCanonical: {
      expectedInstallerType: InstallerType.CET,
      inFiles: [
        ...CET_PREFIXES,
        path.join(`${CET_PREFIX}/exmod/`),
        path.join(`${CET_PREFIX}/exmod/${CET_INIT}`),
      ],
      outInstructions: [
        {
          type: "copy",
          source: path.join(`${CET_PREFIX}/exmod/${CET_INIT}`),
          destination: path.join(`${CET_PREFIX}/exmod/${CET_INIT}`),
        },
      ],
    },
    cetWithTypicalMultipleFilesCanonical: {
      expectedInstallerType: InstallerType.CET,
      inFiles: [
        ...CET_PREFIXES,
        path.join(`${CET_PREFIX}/exmod/`),
        path.join(`${CET_PREFIX}/exmod/AdditionalSubFolder/`),
        path.join(`${CET_PREFIX}/exmod/Modules/`),
        path.join(`${CET_PREFIX}/exmod/configfile.json`),
        path.join(`${CET_PREFIX}/exmod/db.sqlite3`),
        path.join(`${CET_PREFIX}/exmod/${CET_INIT}`),
        path.join(`${CET_PREFIX}/exmod/README.md`),
        path.join(`${CET_PREFIX}/exmod/AdditionalSubFolder/Whoaonemore/`),
        path.join(`${CET_PREFIX}/exmod/AdditionalSubFolder/Whoaonemore/init.lua`),
        path.join(`${CET_PREFIX}/exmod/AdditionalSubFolder/strangestuff.lua`),
        path.join(`${CET_PREFIX}/exmod/Modules/UI.lua`),
        path.join(`${CET_PREFIX}/exmod/Modules/MagicCheats.lua`),
      ],
      outInstructions: [
        {
          type: "copy",
          source: path.join(
            `${CET_PREFIX}/exmod/AdditionalSubFolder/Whoaonemore/init.lua`,
          ),
          destination: path.join(
            `${CET_PREFIX}/exmod/AdditionalSubFolder/Whoaonemore/init.lua`,
          ),
        },
        {
          type: "copy",
          source: path.join(`${CET_PREFIX}/exmod/AdditionalSubFolder/strangestuff.lua`),
          destination: path.join(
            `${CET_PREFIX}/exmod/AdditionalSubFolder/strangestuff.lua`,
          ),
        },
        {
          type: "copy",
          source: path.join(`${CET_PREFIX}/exmod/Modules/UI.lua`),
          destination: path.join(`${CET_PREFIX}/exmod/Modules/UI.lua`),
        },
        {
          type: "copy",
          source: path.join(`${CET_PREFIX}/exmod/Modules/MagicCheats.lua`),
          destination: path.join(`${CET_PREFIX}/exmod/Modules/MagicCheats.lua`),
        },
        {
          type: "copy",
          source: path.join(`${CET_PREFIX}/exmod/configfile.json`),
          destination: path.join(`${CET_PREFIX}/exmod/configfile.json`),
        },
        {
          type: "copy",
          source: path.join(`${CET_PREFIX}/exmod/db.sqlite3`),
          destination: path.join(`${CET_PREFIX}/exmod/db.sqlite3`),
        },
        {
          type: "copy",
          source: path.join(`${CET_PREFIX}/exmod/${CET_INIT}`),
          destination: path.join(`${CET_PREFIX}/exmod/${CET_INIT}`),
        },
        {
          type: "copy",
          source: path.join(`${CET_PREFIX}/exmod/README.md`),
          destination: path.join(`${CET_PREFIX}/exmod/README.md`),
        },
      ],
    },
    cetWithIniFilesCanonical: {
      expectedInstallerType: InstallerType.CET,
      inFiles: [
        ...CET_PREFIXES,
        path.join(`${CET_PREFIX}/exmod/`),
        path.join(`${CET_PREFIX}/exmod/${CET_INIT}`),
        path.join(`${CET_PREFIX}/exmod/some.ini`),
      ],
      outInstructions: [
        {
          type: "copy",
          source: path.join(`${CET_PREFIX}/exmod/${CET_INIT}`),
          destination: path.join(`${CET_PREFIX}/exmod/${CET_INIT}`),
        },
        {
          type: "copy",
          source: path.join(`${CET_PREFIX}/exmod/some.ini`),
          destination: path.join(`${CET_PREFIX}/exmod/some.ini`),
        },
      ],
    },
  }),
);

const CetModShouldPromptForInstall = new Map<string, ExamplePromptInstallableMod>(
  Object.entries({
    cetModWithIniShouldPromptToInstall: {
      expectedInstallerType: InstallerType.Fallback,
      inFiles: [
        path.join(`exmod/`),
        path.join(`exmod/${CET_INIT}`),
        path.join(`exmod/some.ini`),
      ],
      proceedLabel: InstallChoices.Proceed,
      proceedOutInstructions: [
        copiedToSamePath(`exmod\\${CET_INIT}`),
        copiedToSamePath(`exmod\\some.ini`),
      ],
      cancelLabel: InstallChoices.Cancel,
      cancelErrorMessage: `Fallback Installer: user chose to cancel installation`,
    },
  }),
);

const RedscriptMod = new Map<string, ExampleSucceedingMod>(
  Object.entries({
    redsWithSingleFileCanonical: {
      expectedInstallerType: InstallerType.Redscript,
      inFiles: [
        ...REDS_PREFIXES,
        path.join(`${REDS_PREFIX}/rexmod/`),
        path.join(`${REDS_PREFIX}/rexmod/script.reds`),
      ],
      outInstructions: [
        {
          type: "copy",
          source: path.join(`${REDS_PREFIX}/rexmod/script.reds`),
          destination: path.join(`${REDS_PREFIX}/rexmod/script.reds`),
        },
      ],
    },
    redsWithMultipleFilesCanonical: {
      expectedInstallerType: InstallerType.Redscript,
      inFiles: [
        ...REDS_PREFIXES,
        path.join(`${REDS_PREFIX}/rexmod/`),
        path.join(`${REDS_PREFIX}/rexmod/script.reds`),
        path.join(`${REDS_PREFIX}/rexmod/notascript.reds`),
      ],
      outInstructions: [
        {
          type: "copy",
          source: path.join(`${REDS_PREFIX}/rexmod/script.reds`),
          destination: path.join(`${REDS_PREFIX}/rexmod/script.reds`),
        },
        {
          type: "copy",
          source: path.join(`${REDS_PREFIX}/rexmod/notascript.reds`),
          destination: path.join(`${REDS_PREFIX}/rexmod/notascript.reds`),
        },
      ],
    },
    redsIncludingNonRedsFilesCanonical: {
      expectedInstallerType: InstallerType.Redscript,
      inFiles: [
        ...REDS_PREFIXES,
        path.join(`${REDS_PREFIX}/rexmod/`),
        path.join(`${REDS_PREFIX}/rexmod/script.reds`),
        path.join(`${REDS_PREFIX}/rexmod/options.json`),
      ],
      outInstructions: [
        {
          type: "copy",
          source: path.join(`${REDS_PREFIX}/rexmod/script.reds`),
          destination: path.join(`${REDS_PREFIX}/rexmod/script.reds`),
        },
        {
          type: "copy",
          source: path.join(`${REDS_PREFIX}/rexmod/options.json`),
          destination: path.join(`${REDS_PREFIX}/rexmod/options.json`),
        },
      ],
    },
    redsSingleScriptTopLevel: {
      expectedInstallerType: InstallerType.Redscript,
      inFiles: [path.join(`script.reds`)],
      outInstructions: [
        {
          type: "copy",
          source: path.join(`script.reds`),
          destination: path.join(`${REDS_PREFIX}/${FAKE_MOD_NAME}/script.reds`),
        },
      ],
    },
    redsWithMultipleFilesInRedsBaseDir: {
      expectedInstallerType: InstallerType.Redscript,
      inFiles: [
        ...REDS_PREFIXES,
        path.join(`${REDS_PREFIX}/`),
        path.join(`${REDS_PREFIX}/script.reds`),
        path.join(`${REDS_PREFIX}/notascript.reds`),
      ],
      outInstructions: [
        {
          type: "copy",
          source: path.join(`${REDS_PREFIX}/script.reds`),
          destination: path.join(`${REDS_PREFIX}/${FAKE_MOD_NAME}/script.reds`),
        },
        {
          type: "copy",
          source: path.join(`${REDS_PREFIX}/notascript.reds`),
          destination: path.join(`${REDS_PREFIX}/${FAKE_MOD_NAME}/notascript.reds`),
        },
      ],
    },
  }),
);

const RedscriptModShouldPromptForInstall = new Map<string, ExamplePromptInstallableMod>(
  Object.entries({
    redsWithBasedirAndCanonicalFilesPromptsOnConflictForFallback: {
      expectedInstallerType: InstallerType.Redscript,
      inFiles: [
        ...REDS_PREFIXES,
        path.join(`${REDS_PREFIX}/yay.reds`),
        path.join(`${REDS_PREFIX}/rexmod/`),
        path.join(`${REDS_PREFIX}/rexmod/script.reds`),
      ],
      proceedLabel: InstallChoices.Proceed,
      proceedOutInstructions: [
        {
          type: "copy",
          source: path.join(`${REDS_PREFIX}\\yay.reds`),
          destination: path.join(`${REDS_PREFIX}\\yay.reds`),
        },
        {
          type: "copy",
          source: path.join(`${REDS_PREFIX}\\rexmod\\script.reds`),
          destination: path.join(`${REDS_PREFIX}\\rexmod\\script.reds`),
        },
      ],
      cancelLabel: InstallChoices.Cancel,
      cancelErrorMessage: expectedUserCancelMessageFor(InstallerType.Redscript),
    },
    redsWithRedsInToplevelSubdirPromptsOnConflictForFallback: {
      expectedInstallerType: InstallerType.Redscript,
      inFiles: [path.join(`rexmod/script.reds`)],
      proceedLabel: InstallChoices.Proceed,
      proceedOutInstructions: [
        {
          type: "copy",
          source: path.join(`rexmod/script.reds`),
          destination: path.join(`rexmod/script.reds`),
        },
      ],
      cancelLabel: InstallChoices.Cancel,
      cancelErrorMessage: expectedUserCancelMessageFor(InstallerType.Redscript),
    },
    redsPatchWithoutCanonical: {
      expectedInstallerType: InstallerType.Redscript,
      inFiles: [
        ...REDS_PREFIXES,
        path.join(`${REDS_PREFIX}/rexmod/`),
        path.join(`${REDS_PREFIX}/rexmod/dirname/`),
        path.join(`${REDS_PREFIX}/rexmod/dirname/patch.reds`),
      ],
      proceedLabel: InstallChoices.Proceed,
      proceedOutInstructions: [
        {
          type: "copy",
          source: path.join(`${REDS_PREFIX}/rexmod/dirname/patch.reds`),
          destination: path.join(`${REDS_PREFIX}/rexmod/dirname/patch.reds`),
        },
      ],
      cancelLabel: InstallChoices.Cancel,
      cancelErrorMessage: expectedUserCancelMessageFor(InstallerType.Redscript),
    },
  }),
);

const Red4ExtMod = new Map<string, ExampleSucceedingMod>(
  Object.entries({
    red4extWithSingleFileCanonical: {
      expectedInstallerType: InstallerType.Red4Ext,
      inFiles: [
        ...RED4EXT_PREFIXES,
        path.join(`${RED4EXT_PREFIX}/r4emod/`),
        path.join(`${RED4EXT_PREFIX}/r4emod/script.dll`),
      ],
      outInstructions: [
        {
          type: "copy",
          source: path.join(`${RED4EXT_PREFIX}/r4emod/script.dll`),
          destination: path.join(`${RED4EXT_PREFIX}/r4emod/script.dll`),
        },
      ],
    },
    red4extWithMultipleFilesCanonical: {
      expectedInstallerType: InstallerType.Red4Ext,
      inFiles: [
        ...RED4EXT_PREFIXES,
        path.join(`${RED4EXT_PREFIX}/r4emod/`),
        path.join(`${RED4EXT_PREFIX}/r4emod/script.dll`),
        path.join(`${RED4EXT_PREFIX}/r4emod/notascript.dll`),
      ],
      outInstructions: [
        {
          type: "copy",
          source: path.join(`${RED4EXT_PREFIX}/r4emod/script.dll`),
          destination: path.join(`${RED4EXT_PREFIX}/r4emod/script.dll`),
        },
        {
          type: "copy",
          source: path.join(`${RED4EXT_PREFIX}/r4emod/notascript.dll`),
          destination: path.join(`${RED4EXT_PREFIX}/r4emod/notascript.dll`),
        },
      ],
    },
    red4extIncludingNonRedsAndNonemptySubdirsCanonical: {
      expectedInstallerType: InstallerType.Red4Ext,
      inFiles: [
        ...RED4EXT_PREFIXES,
        path.join(`${RED4EXT_PREFIX}/r4emod/`),
        path.join(`${RED4EXT_PREFIX}/r4emod/subsies/`),
        path.join(`${RED4EXT_PREFIX}/r4emod/subsies/whoa.dll`),
        path.join(`${RED4EXT_PREFIX}/r4emod/subsies/totally.dude`),
        path.join(`${RED4EXT_PREFIX}/r4emod/emptysubs/`),
        path.join(`${RED4EXT_PREFIX}/r4emod/script.dll`),
        path.join(`${RED4EXT_PREFIX}/r4emod/options.json`),
        path.join(`${RED4EXT_PREFIX}/r4emod/instructions.txt`),
      ],
      outInstructions: [
        {
          type: "copy",
          source: path.join(`${RED4EXT_PREFIX}/r4emod/script.dll`),
          destination: path.join(`${RED4EXT_PREFIX}/r4emod/script.dll`),
        },
        {
          type: "copy",
          source: path.join(`${RED4EXT_PREFIX}/r4emod/options.json`),
          destination: path.join(`${RED4EXT_PREFIX}/r4emod/options.json`),
        },
        {
          type: "copy",
          source: path.join(`${RED4EXT_PREFIX}/r4emod/instructions.txt`),
          destination: path.join(`${RED4EXT_PREFIX}/r4emod/instructions.txt`),
        },
        {
          type: "copy",
          source: path.join(`${RED4EXT_PREFIX}/r4emod/subsies/whoa.dll`),
          destination: path.join(`${RED4EXT_PREFIX}/r4emod/subsies/whoa.dll`),
        },
        {
          type: "copy",
          source: path.join(`${RED4EXT_PREFIX}/r4emod/subsies/totally.dude`),
          destination: path.join(`${RED4EXT_PREFIX}/r4emod/subsies/totally.dude`),
        },
      ],
    },
    red4extWithDllsInBasedirIsFixableNameable: {
      expectedInstallerType: InstallerType.Red4Ext,
      inFiles: [
        ...RED4EXT_PREFIXES,
        path.join(`${RED4EXT_PREFIX}/`),
        path.join(`${RED4EXT_PREFIX}/script.dll`),
        path.join(`${RED4EXT_PREFIX}/notascript.dll`),
      ],
      outInstructions: [
        {
          type: "copy",
          source: path.join(`${RED4EXT_PREFIX}/script.dll`),
          destination: path.join(`${RED4EXT_PREFIX}/${FAKE_MOD_NAME}/script.dll`),
        },
        {
          type: "copy",
          source: path.join(`${RED4EXT_PREFIX}/notascript.dll`),
          destination: path.join(`${RED4EXT_PREFIX}/${FAKE_MOD_NAME}/notascript.dll`),
        },
      ],
    },
    red4extWithFilesInBasedirANDSubdirsIeInCanonicalIsFixableNameable: {
      expectedInstallerType: InstallerType.Red4Ext,
      inFiles: [
        ...RED4EXT_PREFIXES,
        path.join(`${RED4EXT_PREFIX}/script.dll`),
        path.join(`${RED4EXT_PREFIX}/notcanonicalnow/`),
        path.join(`${RED4EXT_PREFIX}/notcanonicalnow/notascript.dll`),
      ],
      outInstructions: [
        {
          type: "copy",
          source: path.join(`${RED4EXT_PREFIX}/script.dll`),
          destination: path.join(`${RED4EXT_PREFIX}/${FAKE_MOD_NAME}/script.dll`),
        },
        {
          type: "copy",
          source: path.join(`${RED4EXT_PREFIX}/notcanonicalnow/notascript.dll`),
          destination: path.join(
            `${RED4EXT_PREFIX}/${FAKE_MOD_NAME}/notcanonicalnow/notascript.dll`,
          ),
        },
      ],
    },
    red4extWithFilesInToplevelAndMaybeSubdirsIsFixableModnamed: {
      expectedInstallerType: InstallerType.Red4Ext,
      inFiles: [
        ...RED4EXT_PREFIXES,
        path.join(`script.dll`),
        path.join(`notcanonicalnow/`),
        path.join(`notcanonicalnow/notascript.dll`),
      ],
      outInstructions: [
        {
          type: "copy",
          source: path.join(`script.dll`),
          destination: path.join(`${RED4EXT_PREFIX}/${FAKE_MOD_NAME}/script.dll`),
        },
        {
          type: "copy",
          source: path.join(`notcanonicalnow/notascript.dll`),
          destination: path.join(
            `${RED4EXT_PREFIX}/${FAKE_MOD_NAME}/notcanonicalnow/notascript.dll`,
          ),
        },
      ],
    },
    red4extWithFilesInToplevelSubdirIsFixable: {
      expectedInstallerType: InstallerType.Red4Ext,
      inFiles: [
        ...RED4EXT_PREFIXES,
        path.join(`notcanonicalnow/`),
        path.join(`notcanonicalnow/notascript.dll`),
      ],
      outInstructions: [
        {
          type: "copy",
          source: path.join(`notcanonicalnow/notascript.dll`),
          destination: path.join(`${RED4EXT_PREFIX}/notcanonicalnow/notascript.dll`),
        },
      ],
    },
  }),
);

const Red4ExtModShouldFailInTest = new Map<string, ExampleFailingMod>([
  ...RED4EXT_KNOWN_NONOVERRIDABLE_DLL_DIRS.map(
    (dir: string): [string, ExampleFailingMod] => [
      `red4ext DLL in dangerous dir ${dir}`,
      {
        expectedInstallerType: InstallerType.Red4Ext,
        inFiles: [path.join(dir, "some.dll")],
        failure: `Red4Ext Mod Installation Canceled, Dangerous DLL paths!`,
        errorDialogTitle: `Red4Ext Mod Installation Canceled, Dangerous DLL paths!`,
      },
    ],
  ),
  ...RED4EXT_KNOWN_NONOVERRIDABLE_DLLS.map((dll: string): [string, ExampleFailingMod] => [
    `red4ext DLL with reserved name ${dll}`,
    {
      expectedInstallerType: InstallerType.Red4Ext,
      inFiles: [path.join(`bin/x64/scripties.dll`)],
      failure: `Red4Ext Mod Installation Canceled, Dangerous DLL paths!`,
      errorDialogTitle: `Red4Ext Mod Installation Canceled, Dangerous DLL paths!`,
    },
  ]),
]);

const Red4ExtModShouldPromptForInstall = new Map<string, ExamplePromptInstallableMod>(
  Object.entries({
    red4extWithMultipleSubdirsPromptsOnConflictForFallback: {
      expectedInstallerType: InstallerType.Red4Ext,
      inFiles: [
        path.join(`subdir1/`),
        path.join(`subdir1/script1.dll`),
        path.join(`subdir2/`),
        path.join(`subdir2/script2.dll`),
      ],
      proceedLabel: InstallChoices.Proceed,
      proceedOutInstructions: [
        {
          type: "copy",
          source: path.join(`subdir1\\script1.dll`),
          destination: path.join(`subdir1\\script1.dll`),
        },
        {
          type: "copy",
          source: path.join(`subdir2\\script2.dll`),
          destination: path.join(`subdir2\\script2.dll`),
        },
      ],
      cancelLabel: InstallChoices.Cancel,
      cancelErrorMessage: expectedUserCancelMessageFor(InstallerType.Red4Ext),
    },
    red4extWithExtraArchivesInWrongPlacePromptsOnConflictForFallback: {
      expectedInstallerType: InstallerType.Red4Ext,
      inFiles: [
        path.join(`subdir1/`),
        path.join(`subdir1/script1.dll`),
        path.join(`outtaplace.archive`),
      ],
      proceedLabel: InstallChoices.Proceed,
      proceedOutInstructions: [
        {
          type: "copy",
          source: path.join(`subdir1\\script1.dll`),
          destination: path.join(`subdir1\\script1.dll`),
        },
        {
          type: "copy",
          source: path.join(`outtaplace.archive`),
          destination: path.join(`outtaplace.archive`),
        },
      ],
      cancelLabel: InstallChoices.Cancel,
      cancelErrorMessage: expectedUserCancelMessageFor(InstallerType.Red4Ext),
    },
  }),
);

const ArchiveMod = new Map<string, ExampleSucceedingMod>(
  Object.entries({
    archiveWithSingleFileCanonical: {
      expectedInstallerType: InstallerType.Archive,
      inFiles: [...ARCHIVE_PREFIXES, `${ARCHIVE_PREFIX}/first.archive`].map(
        path.normalize,
      ),
      outInstructions: [
        {
          type: "copy",
          source: path.normalize(`${ARCHIVE_PREFIX}/first.archive`),
          destination: path.normalize(`${ARCHIVE_PREFIX}/first.archive`),
        },
      ],
    },
    archiveWithMultipleFilesCanonical: {
      expectedInstallerType: InstallerType.Archive,
      inFiles: [
        ...ARCHIVE_PREFIXES,
        `${ARCHIVE_PREFIX}/first.archive`,
        `${ARCHIVE_PREFIX}/second.archive`,
      ].map(path.normalize),
      outInstructions: [
        {
          type: "copy",
          source: path.normalize(`${ARCHIVE_PREFIX}/first.archive`),
          destination: path.normalize(`${ARCHIVE_PREFIX}/first.archive`),
        },
        {
          type: "copy",
          source: path.normalize(`${ARCHIVE_PREFIX}/second.archive`),
          destination: path.normalize(`${ARCHIVE_PREFIX}/second.archive`),
        },
      ],
    },
    archiveWithMultipleFilesCanonicalButInSubfolder: {
      expectedInstallerType: InstallerType.Archive,
      inFiles: [
        ...ARCHIVE_PREFIXES,
        `${ARCHIVE_PREFIX}/fold1/first.archive`,
        `${ARCHIVE_PREFIX}/fold1/second.archive`,
      ].map(path.normalize),
      outInstructions: [
        {
          type: "copy",
          source: path.normalize(`${ARCHIVE_PREFIX}/fold1/first.archive`),
          destination: path.normalize(`${ARCHIVE_PREFIX}/fold1/first.archive`),
        },
        {
          type: "copy",
          source: path.normalize(`${ARCHIVE_PREFIX}/fold1/second.archive`),
          destination: path.normalize(`${ARCHIVE_PREFIX}/fold1/second.archive`),
        },
      ],
    },
    archiveWithMultipleFilesInHeritageFolderFixable: {
      expectedInstallerType: InstallerType.Archive,
      inFiles: [
        ...ARCHIVE_PREFIXES,
        `${ARCHIVE_MOD_TRADITIONAL_WRONG_PREFIX}/first.archive`,
        `${ARCHIVE_MOD_TRADITIONAL_WRONG_PREFIX}/second.archive`,
      ].map(path.normalize),
      outInstructions: [
        {
          type: "copy",
          source: path.normalize(`${ARCHIVE_MOD_TRADITIONAL_WRONG_PREFIX}/first.archive`),
          destination: path.normalize(`${ARCHIVE_PREFIX}/first.archive`),
        },
        {
          type: "copy",
          source: path.normalize(
            `${ARCHIVE_MOD_TRADITIONAL_WRONG_PREFIX}/second.archive`,
          ),
          destination: path.normalize(`${ARCHIVE_PREFIX}/second.archive`),
        },
      ],
    },
    archiveWithSingleArchiveToplevel: {
      expectedInstallerType: InstallerType.Archive,
      inFiles: ["first.archive"].map(path.normalize),
      outInstructions: [
        {
          type: "copy",
          source: path.normalize("first.archive"),
          destination: path.normalize(`${ARCHIVE_PREFIX}/first.archive`),
        },
      ],
    },
    archiveWithMultipleArchivesTopLevel: {
      expectedInstallerType: InstallerType.Archive,
      inFiles: ["first.archive", "second.archive"].map(path.normalize),
      outInstructions: [
        {
          type: "copy",
          source: path.normalize("first.archive"),
          destination: path.normalize(`${ARCHIVE_PREFIX}/first.archive`),
        },
        {
          type: "copy",
          source: path.normalize("second.archive"),
          destination: path.normalize(`${ARCHIVE_PREFIX}/second.archive`),
        },
      ],
    },
    archiveWithArchivesInRandomFolder: {
      expectedInstallerType: InstallerType.Archive,
      inFiles: ["fold1/", "fold1/first.archive", "fold1/second.archive"].map(
        path.normalize,
      ),
      outInstructions: [
        {
          type: "copy",
          source: path.normalize("fold1/first.archive"),
          destination: path.normalize(`${ARCHIVE_PREFIX}/fold1/first.archive`),
        },
        {
          type: "copy",
          source: path.normalize("fold1/second.archive"),
          destination: path.normalize(`${ARCHIVE_PREFIX}/fold1/second.archive`),
        },
      ],
    },
    archiveWithArchivesTopLevelAndFolder: {
      expectedInstallerType: InstallerType.Archive,
      inFiles: ["first.archive", "fold1/", "fold1/second.archive"].map(path.normalize),
      outInstructions: [
        {
          type: "copy",
          source: path.normalize("first.archive"),
          destination: path.normalize(`${ARCHIVE_PREFIX}/first.archive`),
        },
        {
          type: "copy",
          source: path.normalize("fold1/second.archive"),
          destination: path.normalize(`${ARCHIVE_PREFIX}/fold1/second.archive`),
        },
      ],
    },
    archiveWithArchivesInRandomFolderPlusRandomFiles: {
      expectedInstallerType: InstallerType.Archive,
      inFiles: [
        "fold1/",
        "fold1/first.archive",
        "fold1/foobar.txt",
        "fold1/more",
        "fold1/second.archive",
        "fold1/thisisenough.md",
      ].map(path.normalize),
      outInstructions: [
        {
          type: "copy",
          source: path.normalize("fold1/first.archive"),
          destination: path.normalize(`${ARCHIVE_PREFIX}/fold1/first.archive`),
        },
        {
          type: "copy",
          source: path.normalize("fold1/foobar.txt"),
          destination: path.normalize(`${ARCHIVE_PREFIX}/fold1/foobar.txt`),
        },
        {
          type: "copy",
          source: path.normalize("fold1/more"),
          destination: path.normalize(`${ARCHIVE_PREFIX}/fold1/more`),
        },
        {
          type: "copy",
          source: path.normalize("fold1/second.archive"),
          destination: path.normalize(`${ARCHIVE_PREFIX}/fold1/second.archive`),
        },
        {
          type: "copy",
          source: path.normalize("fold1/thisisenough.md"),
          destination: path.normalize(`${ARCHIVE_PREFIX}/fold1/thisisenough.md`),
        },
      ],
    },
    archiveXLWithFilesWithMatchingNamesInCanonicalDir: {
      expectedInstallerType: InstallerType.Archive,
      inFiles: [
        ...ARCHIVE_PREFIXES,
        path.join(`${ARCHIVE_PREFIX}\\mybigarchive.archive`),
        path.join(`${ARCHIVE_PREFIX}\\mybigarchive.xl`),
      ],
      outInstructions: [
        copiedToSamePath(`${ARCHIVE_PREFIX}\\mybigarchive.xl`),
        copiedToSamePath(`${ARCHIVE_PREFIX}\\mybigarchive.archive`),
      ],
    },
    archiveXLWithFilesWithDifferentNamesInCanonicalDir: {
      expectedInstallerType: InstallerType.Archive,
      inFiles: [
        ...ARCHIVE_PREFIXES,
        path.join(`${ARCHIVE_PREFIX}\\mybigarchive.archive`),
        path.join(`${ARCHIVE_PREFIX}\\surprise.xl`),
      ],
      outInstructions: [
        copiedToSamePath(`${ARCHIVE_PREFIX}\\surprise.xl`),
        copiedToSamePath(`${ARCHIVE_PREFIX}\\mybigarchive.archive`),
      ],
    },
    archiveXLWithMultipleFilesInCanonicalDir: {
      expectedInstallerType: InstallerType.Archive,
      inFiles: [
        ...ARCHIVE_PREFIXES,
        path.join(`${ARCHIVE_PREFIX}\\mybigarchive.archive`),
        path.join(`${ARCHIVE_PREFIX}\\mybigarchif.archive`),
        path.join(`${ARCHIVE_PREFIX}\\surprise.xl`),
        path.join(`${ARCHIVE_PREFIX}\\surprise2.xl`),
      ],
      outInstructions: [
        copiedToSamePath(`${ARCHIVE_PREFIX}\\surprise.xl`),
        copiedToSamePath(`${ARCHIVE_PREFIX}\\surprise2.xl`),
        copiedToSamePath(`${ARCHIVE_PREFIX}\\mybigarchive.archive`),
        copiedToSamePath(`${ARCHIVE_PREFIX}\\mybigarchif.archive`),
      ],
    },
    archiveXLWithMultipleArchivesOnlyInCanonicalDir: {
      expectedInstallerType: InstallerType.Archive,
      inFiles: [
        ...ARCHIVE_PREFIXES,
        path.join(`${ARCHIVE_PREFIX}\\surprise.xl`),
        path.join(`${ARCHIVE_PREFIX}\\mybigarchive.archive`),
        path.join(`${ARCHIVE_PREFIX}\\mybigarchif.archive`),
      ],
      outInstructions: [
        copiedToSamePath(`${ARCHIVE_PREFIX}\\surprise.xl`),
        copiedToSamePath(`${ARCHIVE_PREFIX}\\mybigarchive.archive`),
        copiedToSamePath(`${ARCHIVE_PREFIX}\\mybigarchif.archive`),
      ],
    },
    archiveXLWithoutArchiveFilesInCanonicalDir: {
      expectedInstallerType: InstallerType.Archive,
      inFiles: [...ARCHIVE_PREFIXES, path.join(`${ARCHIVE_PREFIX}\\surprise.xl`)],
      outInstructions: [copiedToSamePath(`${ARCHIVE_PREFIX}\\surprise.xl`)],
    },
  }),
);

const ArchiveOnlyModShouldPromptForInstall = new Map<string, ExamplePromptInstallableMod>(
  Object.entries({
    archiveWithToplevelAndCanonicalFilesPromptsOnConflictForFallback: {
      expectedInstallerType: InstallerType.Archive,
      inFiles: [
        ...ARCHIVE_PREFIXES,
        path.join(`outtaplace.archive`),
        path.join(`${ARCHIVE_PREFIX}/innaspot.archive`),
      ],
      proceedLabel: InstallChoices.Proceed,
      proceedOutInstructions: [
        {
          type: "copy",
          source: path.join(`outtaplace.archive`),
          destination: path.join(`outtaplace.archive`),
        },
        {
          type: "copy",
          source: path.join(`${ARCHIVE_PREFIX}\\innaspot.archive`),
          destination: path.join(`${ARCHIVE_PREFIX}\\innaspot.archive`),
        },
      ],
      cancelLabel: InstallChoices.Cancel,
      cancelErrorMessage: expectedUserCancelMessageFor(InstallerType.Archive),
    },
  }),
);

const ValidExtraArchivesWithType = new Map<string, ExampleSucceedingMod>(
  Object.entries({
    cetWithExtraArchiveFilesCanonical: {
      expectedInstallerType: InstallerType.CET,
      inFiles: [
        ...CET_PREFIXES,
        path.join(`${CET_PREFIX}/exmod/`),
        path.join(`${CET_PREFIX}/exmod/Modules/`),
        path.join(`${CET_PREFIX}/exmod/configfile.json`),
        path.join(`${CET_PREFIX}/exmod/${CET_INIT}`),
        path.join(`${CET_PREFIX}/exmod/Modules/UI.lua`),
        ...ARCHIVE_PREFIXES,
        path.join(`${ARCHIVE_PREFIX}/preemtextures.archive`),
      ],
      outInstructions: [
        copiedToSamePath(`${CET_PREFIX}/exmod/Modules/UI.lua`),
        copiedToSamePath(`${CET_PREFIX}/exmod/configfile.json`),
        copiedToSamePath(`${CET_PREFIX}/exmod/${CET_INIT}`),
        copiedToSamePath(`${ARCHIVE_PREFIX}/preemtextures.archive`),
      ],
    },
    cetWithExtraArchiveXLFilesOnlyCanonical: {
      expectedInstallerType: InstallerType.CET,
      inFiles: [
        ...CET_PREFIXES,
        path.join(`${CET_PREFIX}/exmod/`),
        path.join(`${CET_PREFIX}/exmod/Modules/`),
        path.join(`${CET_PREFIX}/exmod/configfile.json`),
        path.join(`${CET_PREFIX}/exmod/${CET_INIT}`),
        path.join(`${CET_PREFIX}/exmod/Modules/UI.lua`),
        ...ARCHIVE_PREFIXES,
        path.join(`${ARCHIVE_PREFIX}/preemtextures.xl`),
      ],
      outInstructions: [
        copiedToSamePath(`${CET_PREFIX}/exmod/Modules/UI.lua`),
        copiedToSamePath(`${CET_PREFIX}/exmod/configfile.json`),
        copiedToSamePath(`${CET_PREFIX}/exmod/${CET_INIT}`),
        copiedToSamePath(`${ARCHIVE_PREFIX}/preemtextures.xl`),
      ],
    },
    redsWithExtraArchiveFilesCanonical: {
      expectedInstallerType: InstallerType.Redscript,
      inFiles: [
        ...REDS_PREFIXES,
        path.join(`${REDS_PREFIX}/rexmod/`),
        path.join(`${REDS_PREFIX}/rexmod/scriptiesyay.reds`),
        path.join(`${REDS_PREFIX}/rexmod/morescripties.reds`),
        path.join(`${REDS_PREFIX}/rexmod/options.json`),
        ...ARCHIVE_PREFIXES,
        path.join(`${ARCHIVE_PREFIX}/magicgoeshere.archive`),
        path.join(`${ARCHIVE_PREFIX}/magicgoesherebutbigger.xl`),
      ],
      outInstructions: [
        copiedToSamePath(`${REDS_PREFIX}/rexmod/scriptiesyay.reds`),
        copiedToSamePath(`${REDS_PREFIX}/rexmod/morescripties.reds`),
        copiedToSamePath(`${REDS_PREFIX}/rexmod/options.json`),
        copiedToSamePath(`${ARCHIVE_PREFIX}\\magicgoesherebutbigger.xl`),
        copiedToSamePath(`${ARCHIVE_PREFIX}/magicgoeshere.archive`),
      ],
    },
    redsWithExtraArchiveXLFilesOnlyCanonical: {
      expectedInstallerType: InstallerType.Redscript,
      inFiles: [
        ...REDS_PREFIXES,
        path.join(`${REDS_PREFIX}/rexmod/`),
        path.join(`${REDS_PREFIX}/rexmod/scriptiesyay.reds`),
        path.join(`${REDS_PREFIX}/rexmod/morescripties.reds`),
        path.join(`${REDS_PREFIX}/rexmod/options.json`),
        ...ARCHIVE_PREFIXES,
        path.join(`${ARCHIVE_PREFIX}/magicgoesherebutbigger.xl`),
      ],
      outInstructions: [
        copiedToSamePath(`${REDS_PREFIX}/rexmod/scriptiesyay.reds`),
        copiedToSamePath(`${REDS_PREFIX}/rexmod/morescripties.reds`),
        copiedToSamePath(`${REDS_PREFIX}/rexmod/options.json`),
        copiedToSamePath(`${ARCHIVE_PREFIX}\\magicgoesherebutbigger.xl`),
      ],
    },
  }),
);

const ConfigXmlMod = new Map<string, ExampleSucceedingMod>(
  Object.entries({
    configXmlWithRandomNameInCanonicalBasedirWillInstall: {
      expectedInstallerType: InstallerType.ConfigXml,
      inFiles: [path.join(`${CONFIG_XML_MOD_BASEDIR}\\dunnowhythisishere.xml`)],
      outInstructions: [
        copiedToSamePath(path.join(`${CONFIG_XML_MOD_BASEDIR}\\dunnowhythisishere.xml`)),
      ],
    },
  }),
);

const ConfigXmlModShouldPromptToInstall = new Map<string, ExamplePromptInstallableMod>([
  ...CONFIG_XML_MOD_PROTECTED_FILES.map(
    (xml: string): [string, ExamplePromptInstallableMod] => [
      `Protected XML file ${path.basename(xml)} in XML basedir prompts to install`,
      {
        expectedInstallerType: InstallerType.ConfigXml,
        inFiles: [path.join(xml)],
        proceedLabel: InstallChoices.Proceed,
        proceedOutInstructions: [copiedToSamePath(xml)],
        cancelLabel: InstallChoices.Cancel,
        cancelErrorMessage: expectedUserCancelProtectedMessageFor(
          InstallerType.ConfigXml,
        ),
      },
    ],
  ),
  ...CONFIG_XML_MOD_PROTECTED_FILENAMES.map(
    (xmlname: string): [string, ExamplePromptInstallableMod] => [
      `Protected XML file ${xmlname} in toplevel prompts to install into XML basedir`,
      {
        expectedInstallerType: InstallerType.ConfigXml,
        inFiles: [path.join(xmlname)],
        proceedLabel: InstallChoices.Proceed,
        proceedOutInstructions: [
          {
            type: `copy`,
            source: path.join(xmlname),
            destination: path.join(`${CONFIG_XML_MOD_BASEDIR}\\${xmlname}`),
          },
        ],
        cancelLabel: InstallChoices.Cancel,
        cancelErrorMessage: expectedUserCancelProtectedMessageFor(
          InstallerType.ConfigXml,
        ),
      },
    ],
  ),
  [
    `Config XML files when there's a combination of protected and non-protected canonical prompts to install`,
    {
      expectedInstallerType: InstallerType.ConfigXml,
      inFiles: [
        CONFIG_XML_MOD_PROTECTED_FILES[0],
        path.join(`${CONFIG_XML_MOD_BASEDIR}\\weeblewobble.xml`),
      ],
      proceedLabel: InstallChoices.Proceed,
      proceedOutInstructions: [
        copiedToSamePath(CONFIG_XML_MOD_PROTECTED_FILES[0]),
        copiedToSamePath(`${CONFIG_XML_MOD_BASEDIR}\\weeblewobble.xml`),
      ],
      cancelLabel: InstallChoices.Cancel,
      cancelErrorMessage: expectedUserCancelProtectedMessageFor(InstallerType.ConfigXml),
    },
  ],
  [
    `Config XML files with random XML file in toplevel prompts to install via Fallback`,
    {
      expectedInstallerType: InstallerType.ConfigXml,
      inFiles: [path.join(`myfancy.xml`)],
      proceedLabel: InstallChoices.Proceed,
      proceedOutInstructions: [copiedToSamePath(path.join(`myfancy.xml`))],
      cancelLabel: InstallChoices.Cancel,
      cancelErrorMessage: expectedUserCancelMessageFor(InstallerType.Fallback),
    },
  ],
]);

const JsonMod = new Map<string, ExampleSucceedingMod>(
  Object.entries({
    jsonWithValidFileInRoot: {
      expectedInstallerType: InstallerType.Json,
      inFiles: ["giweights.json"].map(path.normalize),
      outInstructions: [
        {
          type: "copy",
          source: path.normalize("giweights.json"),
          destination: path.normalize("engine/config/giweights.json"),
        },
      ],
    },
    jsonInRandomFolder: {
      expectedInstallerType: InstallerType.Json,
      inFiles: ["fold1/", "fold1/giweights.json", "fold1/bumpersSettings.json"].map(
        path.normalize,
      ),
      outInstructions: [
        {
          type: "copy",
          source: path.normalize("fold1/giweights.json"),
          destination: path.normalize("engine/config/giweights.json"),
        },
        {
          type: "copy",
          source: path.normalize("fold1/bumpersSettings.json"),
          destination: path.normalize("r6/config/bumpersSettings.json"),
        },
      ],
    },
    jsonWithFilesInCorrectFolder: {
      expectedInstallerType: InstallerType.Json,
      inFiles: [
        "engine/",
        "engine/config/",
        "engine/config/giweights.json",
        "r6/",
        "r6/config",
        "r6/config/bumpersSettings.json",
        "r6/config/settings/",
        "r6/config/settings/options.json",
        "r6/config/settings/platform/",
        "r6/config/settings/platform/pc/",
        "r6/config/settings/platform/pc/options.json",
      ].map(path.normalize),
      outInstructions: [
        {
          type: "copy",
          source: path.normalize("engine/config/giweights.json"),
          destination: path.normalize("engine/config/giweights.json"),
        },
        {
          type: "copy",
          source: path.normalize("r6/config/bumpersSettings.json"),
          destination: path.normalize("r6/config/bumpersSettings.json"),
        },
        {
          type: "copy",
          source: path.normalize("r6/config/settings/options.json"),
          destination: path.normalize("r6/config/settings/options.json"),
        },
        {
          type: "copy",
          source: path.normalize("r6/config/settings/platform/pc/options.json"),
          destination: path.normalize("r6/config/settings/platform/pc/options.json"),
        },
      ],
    },
  }), // object
);

// These errordialogs should be fixed as part o https://github.com/E1337Kat/cyberpunk2077_ext_redux/issues/113
const JsonModShouldFailInTest = new Map<string, ExampleFailingMod>(
  Object.entries({
    jsonWithInvalidFileInRootFailsInTest: {
      expectedInstallerType: InstallerType.NotSupported,
      inFiles: ["giweights.json", "options.json"].map(path.normalize),
      failure:
        "Improperly located options.json file found.  We don't know where it belongs.",
      errorDialogTitle: undefined,
    },
    jsonWithUnknownFileFailsInTest: {
      expectedInstallerType: InstallerType.NotSupported,
      inFiles: ["My app", "My app/Cool.exe", "My app/config.json"].map(path.normalize),
      failure: "Found JSON files that aren't part of the game.",
      errorDialogTitle: undefined,
    },
  }),
);

const IniMod = new Map<string, ExampleSucceedingMod>(
  Object.entries({
    iniWithSingleIniAtRoot: {
      expectedInstallerType: InstallerType.INI,
      inFiles: ["myawesomeconfig.ini"].map(path.normalize),
      outInstructions: [
        {
          type: "copy",
          source: path.normalize("myawesomeconfig.ini"),
          destination: path.normalize(`${CONFIG_INI_MOD_BASEDIR}/myawesomeconfig.ini`),
        },
      ],
    },
    iniWithMultipleIniAtRoot: {
      expectedInstallerType: InstallerType.INI,
      inFiles: ["myawesomeconfig.ini", "serious.ini"].map(path.normalize),
      outInstructions: [
        {
          type: "copy",
          source: path.normalize("myawesomeconfig.ini"),
          destination: path.normalize(`${CONFIG_INI_MOD_BASEDIR}/myawesomeconfig.ini`),
        },
        {
          type: "copy",
          source: path.normalize("serious.ini"),
          destination: path.normalize(`${CONFIG_INI_MOD_BASEDIR}/serious.ini`),
        },
      ],
    },
    iniWithReshadeIniAtRoot: {
      expectedInstallerType: InstallerType.INI,
      inFiles: ["superreshade.ini"].map(path.normalize),
      outInstructions: [
        {
          type: "copy",
          source: "superreshade.ini",
          destination: path.normalize(`${CONFIG_RESHADE_MOD_BASEDIR}/superreshade.ini`),
        },
      ],
    },
    iniWithSingleIniInRandomFolder: {
      expectedInstallerType: InstallerType.INI,
      inFiles: ["fold1/", "fold1/myawesomeconfig.ini"].map(path.normalize),
      outInstructions: [
        {
          type: "copy",
          source: path.normalize("fold1/myawesomeconfig.ini"),
          destination: path.normalize(`${CONFIG_INI_MOD_BASEDIR}/myawesomeconfig.ini`),
        },
      ],
    },
    iniWithReshadeIniAndShadersFolder: {
      expectedInstallerType: InstallerType.INI,
      inFiles: [
        "superreshade.ini",
        "reshade-shaders/",
        "reshade-shaders/Shaders/",
        "reshade-shaders/Shaders/fancy.fx",
        "reshade-shaders/Textures/",
        "reshade-shaders/Textures/lut.png",
      ].map(path.normalize),
      outInstructions: [
        {
          type: "copy",
          source: "superreshade.ini",
          destination: path.normalize(`${CONFIG_RESHADE_MOD_BASEDIR}/superreshade.ini`),
        },
        {
          type: "copy",
          source: path.normalize("reshade-shaders/Shaders/fancy.fx"),
          destination: path.normalize(
            `${CONFIG_RESHADE_MOD_SHADER_BASEDIR}/Shaders/fancy.fx`,
          ),
        },
        {
          type: "copy",
          source: path.normalize("reshade-shaders/Textures/lut.png"),
          destination: path.normalize(
            `${CONFIG_RESHADE_MOD_SHADER_BASEDIR}/Textures/lut.png`,
          ),
        },
      ],
    },
    iniWithReshadeIniAndShadersInAFolder: {
      expectedInstallerType: InstallerType.INI,
      inFiles: [
        "fold1/superreshade.ini",
        "fold1/reshade-shaders/",
        "fold1/reshade-shaders/Shaders/",
        "fold1/reshade-shaders/Shaders/fancy.fx",
        "fold1/reshade-shaders/Textures/",
        "fold1/reshade-shaders/Textures/lut.png",
      ].map(path.normalize),
      outInstructions: [
        {
          type: "copy",
          source: path.normalize("fold1/superreshade.ini"),
          destination: path.normalize(`${CONFIG_RESHADE_MOD_BASEDIR}/superreshade.ini`),
        },
        {
          type: "copy",
          source: path.normalize("fold1/reshade-shaders/Shaders/fancy.fx"),
          destination: path.normalize(
            `${CONFIG_RESHADE_MOD_SHADER_BASEDIR}/Shaders/fancy.fx`,
          ),
        },
        {
          type: "copy",
          source: path.normalize(`fold1/reshade-shaders/Textures/lut.png`),
          destination: path.normalize(
            `${CONFIG_RESHADE_MOD_SHADER_BASEDIR}/Textures/lut.png`,
          ),
        },
      ],
    },
  }), // object
);

const FallbackForNonMatchedAndInvalidShouldPromptForInstall = new Map<
  string,
  ExamplePromptInstallableMod
>(
  Object.entries({
    invalidModContainingJustAnExe: {
      expectedInstallerType: InstallerType.Fallback,
      inFiles: [path.normalize("bin/myProg.exe")],
      proceedLabel: InstallChoices.Proceed,
      proceedOutInstructions: [
        {
          type: "copy",
          source: path.normalize("bin/myProg.exe"),
          destination: path.normalize("bin/myProg.exe"),
        },
      ],
      cancelLabel: InstallChoices.Cancel,
      cancelErrorMessage: expectedUserCancelMessageFor(InstallerType.Fallback),
    },
    invalidModContainingRandomFiles: {
      expectedInstallerType: InstallerType.Fallback,
      inFiles: ["Categorized AIO Command List.xlsx", "readme.md"],
      proceedLabel: InstallChoices.Proceed,
      proceedOutInstructions: [
        {
          type: "copy",
          source: path.normalize("Categorized AIO Command List.xlsx"),
          destination: path.normalize("Categorized AIO Command List.xlsx"),
        },
        {
          type: "copy",
          source: path.normalize("readme.md"),
          destination: path.normalize("readme.md"),
        },
      ],
      cancelLabel: InstallChoices.Cancel,
      cancelErrorMessage: expectedUserCancelMessageFor(InstallerType.Fallback),
    },
    invalidModWithDeepInvalidPath: {
      expectedInstallerType: InstallerType.Fallback,
      inFiles: [
        ...pathHierarchyFor(FAKE_STAGING_PATH),
        path.join(FAKE_STAGING_PATH, "toodles.txt"),
      ],
      proceedLabel: InstallChoices.Proceed,
      proceedOutInstructions: [
        {
          type: "copy",
          source: path.join(FAKE_STAGING_PATH, "toodles.txt"),
          destination: path.join(FAKE_STAGING_PATH, "toodles.txt"),
        },
      ],
      cancelLabel: InstallChoices.Cancel,
      cancelErrorMessage: expectedUserCancelMessageFor(InstallerType.Fallback),
    },
    // Fallback for mods containing JSON that will later be handled by AMM
    validAmmModUsingFallback: {
      expectedInstallerType: InstallerType.Fallback,
      inFiles: [
        ...ARCHIVE_PREFIXES,
        path.join(ARCHIVE_PREFIX, "proximas_propshop_v4.archive"),
        ...pathHierarchyFor(AMM_MOD_PREFIX),
        path.join(AMM_MOD_PREFIX, "Collabs/"),
        path.join(AMM_MOD_PREFIX, "Collabs/Custom Props/"),
        path.join(AMM_MOD_PREFIX, "Collabs/Custom Props/proximas_propshop_v4.lua"),
        path.join(AMM_MOD_PREFIX, "User/"),
        path.join(AMM_MOD_PREFIX, "User/Decor/"),
        path.join(AMM_MOD_PREFIX, "User/Decor/Cyber Noir Flat.json"),
      ],
      proceedLabel: InstallChoices.Proceed,
      proceedOutInstructions: [
        copiedToSamePath(path.join(ARCHIVE_PREFIX, "proximas_propshop_v4.archive")),
        copiedToSamePath(
          path.join(AMM_MOD_PREFIX, "Collabs/Custom Props/proximas_propshop_v4.lua"),
        ),
        copiedToSamePath(path.join(AMM_MOD_PREFIX, "User/Decor/Cyber Noir Flat.json")),
      ],
      cancelLabel: InstallChoices.Cancel,
      cancelErrorMessage: expectedUserCancelMessageFor(InstallerType.Fallback),
    },
  }), // object
);

// The instructions will be grouped in the order that we try
// to match things, and normally within them.
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

const GiftwrappedModsFixable = new Map<string, ExampleSucceedingMod>(
  Object.entries({
    multipleModtypesWrappedAreUnwrappedFixable: {
      expectedInstallerType: InstallerType.MultiType,
      inFiles: [
        ...CET_GIFTWRAPS,
        path.join(`${GIFTWRAP_PREFIX}/${CET_PREFIX}/exmod/${CET_INIT}`),
        ...REDS_GIFTWRAPS,
        path.join(`${GIFTWRAP_PREFIX}/${REDS_PREFIX}/rexmod/script.reds`),
        ...RED4EXT_GIFTWRAPS,
        path.join(`${GIFTWRAP_PREFIX}/${RED4EXT_PREFIX}/script.dll`),
        ...ARCHIVE_GIFTWRAPS,
        path.join(`${GIFTWRAP_PREFIX}/${ARCHIVE_PREFIX}/magicgoeshere.archive`),
      ],
      outInstructions: [
        {
          type: "copy",
          source: path.join(`${GIFTWRAP_PREFIX}/${CET_PREFIX}/exmod/${CET_INIT}`),
          destination: path.join(`${CET_PREFIX}/exmod/${CET_INIT}`),
        },
        {
          type: "copy",
          source: path.join(`${GIFTWRAP_PREFIX}/${REDS_PREFIX}/rexmod/script.reds`),
          destination: path.join(`${REDS_PREFIX}/rexmod/script.reds`),
        },
        {
          type: "copy",
          source: path.join(`${GIFTWRAP_PREFIX}/${RED4EXT_PREFIX}/script.dll`),
          destination: path.join(`${RED4EXT_PREFIX}/${FAKE_MOD_NAME}/script.dll`),
        },
        {
          type: "copy",
          source: path.join(`${GIFTWRAP_PREFIX}/${ARCHIVE_PREFIX}/magicgoeshere.archive`),
          destination: path.join(`${ARCHIVE_PREFIX}/magicgoeshere.archive`),
        },
      ],
    },
  }),
);

export const AllExpectedSuccesses = new Map<string, ExampleModCategory>(
  Object.entries({
    CoreCetInstall,
    CoreRedscriptInstall,
    CoreRed4ExtInstall,
    CoreCsvMergeInstall,
    CoreWolvenkitCliInstall,
    CoreTweakXLInstall,
    TweakXLMod,
    CoreArchiveXLInstall,
    AsiMod,
    CetMod,
    RedscriptMod,
    Red4ExtMod,
    ConfigXmlMod,
    JsonMod,
    IniMod,
    ArchiveOnly: ArchiveMod,
    ValidExtraArchivesWithType,
    ValidTypeCombinations,
    GiftwrappedModsFixable,
  }),
);

export const AllExpectedDirectFailures = new Map<string, ExampleFailingModCategory>(
  Object.entries({
    JsonModShouldFailInTest,
    Red4ExtModShouldFailInTest,
    CoreWolvenKitShouldFailInTest,
    CoreTweakXLShouldFailOnInstallIfNotExactLayout,
    CoreArchiveXLShouldFailOnInstallIfNotExactLayout,
  }),
);

export const AllExpectedInstallPromptables = new Map<
  string,
  ExamplePromptInstallableModCategory
>(
  Object.entries({
    MultiTypeModShouldPromptForInstall,
    RedscriptModShouldPromptForInstall,
    Red4ExtModShouldPromptForInstall,
    TweakXLModShouldPromptForInstall,
    ArchiveOnlyModShouldPromptForInstall,
    FallbackForNonMatchedAndInvalidShouldPromptForInstall,
    ConfigXmlModShouldPromptToInstall,
    CetModShouldPromptForInstall,
  }),
);
