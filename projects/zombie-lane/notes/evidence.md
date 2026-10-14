# Evidence index

REA evidence behind the notes in this folder. The evidence records themselves are kept locally by whoever ran the
analysis and are **not committed**, because they contain decompiled code. Re-run the same operation on an APK
with the same SHA-256 to reproduce them.

- **Target:** `zombie-lane-1-0-33-multi-android.apk`, SHA-256
  `39b93f6f5409a3e9f84a47efdd23e3067333117bc5edad6c27887091ebda0ad6`
- **Tools:** REA `rea-agents@6.4.0` (CLI and MCP), JADX provider `jadx-headless-mcp` 0.7.1 (JAR SHA-256
  `6e5eacf5…ff75`, source revision `5844800a`), Temurin JDK 26
- **Date:** 2026-10-14

| Ref | Operation | Subject | Evidence ID |
| --- | --------- | ------- | ----------- |
| `E-package` | inspect_android_package | manifest, permissions, counts | `ev_b4cf5094241465dc51d1921cfde05b721048c4d3259cd2fab1851bff2408468c` |
| `E-classes` | search_android_classes | all 2,137 classes (complete) | `ev_728296067849b5d07e07619499eb94f77f7e0559ed3b774fdc4f57d41e722d89` |
| `E-inventory` | inspect_artifact (MCP) | archive member graph | `ev_20883279a166934e09109385e297d9ea8c96ada593ba4a6a6a9ed3c5c2ad77ee` |
| `E-extract` | extract_artifact (MCP) | 1,471 regular files, containment verified | `ev_df0a18724be18ec03c7a6c99a647dd77c2aa9c1df198e29ad6fc8b2dcdbc7451` |
| `E-Toolkit` | inspect_android_class | `com.dchoc.toolkit.Toolkit` | `ev_cc10de54829cb8efd434478bd6239c8b79442a47eabaf6bd7ab746309e822014` |
| `E-loadFile` | inspect_android_method | `Toolkit.loadFile` | `ev_7f1f578946c1d721043b57c48c5b05db05eb1bcfbf6119fe6c9b3b5dd94c3c63` |
| `E-fromLoaded` | inspect_android_method | `Toolkit.getResourceBytesFromLoadedFile` | `ev_748ac43ded632c3b77eca038cf991d39b16b4a1ad9abe46a0fa8992d5312c117` |
| `E-getResBytes` | inspect_android_method | `Toolkit.getResourceBytes(int)` (overload 0) | `ev_f6433890ed09fa6b078478c44713c7cf3b373f10ce454cb95b1054c185266ed8` |
| `E-getText` | inspect_android_method | `Toolkit.getText` | `ev_ca2f8361bb1f0437cc61987c8affe6e52037907e496a14c934a40af0882265a4` |
| `E-DChocMIDlet` | inspect_android_class | `com.dchoc.toolkit.DChocMIDlet` | `ev_cf06d9f547baa9ba9062a2dbd6750a3ed91fcf2f13c765525077054ab8294a18` |
| `E-run` | inspect_android_method | `DChocMIDlet.run` | `ev_1963b7a898a6b08fd545d9d4f15fa7eaf3872a4b4bdd05500685b1fa0081e445` |
| `E-updateTimer` | inspect_android_method | `DChocMIDlet.updateTimer` | `ev_312c655d927c07e9068bdcc7a66bb8e16cdc3e442cc59cac17e4d9a2f78ce082` |
| `E-realDelta` | inspect_android_method | `DChocMIDlet.getRealDeltaTime` | `ev_4926f0d43fd7b854a37d6281aebd6062c8a82e3482adcef1e9d5c3d5cf65409b` |
| `E-IController` | inspect_android_class | `com.dchoc.toolkit.IController` | `ev_fcc001b4d4e93b75dc61c6a87da05a282efab074b3729a1e720d470c1a61a496` |
| `E-DCiDead` | inspect_android_class | `com.dchoc.DCiDead` | `ev_6e509b63161fd0744cd604c2ac9d127572c4bfe29867545ee25c0c881456c483` |
| `E-DCRenderer` | inspect_android_class | `javax.microedition.lcdui.DCRenderer` | `ev_8604b5a9c4b85258a738b6e1df75206271a17b6885a7354b5a147fd3e1f3d554` |
| `E-onDrawFrame` | inspect_android_method | `DCRenderer.onDrawFrame` | `ev_2957039237d8e21ba9ad88c69d7da07c5549f0a0bc9aed71d8295789f4f5cbcc` |
| `E-GameEngine` | inspect_android_class | `com.dchoc.idead.GameEngine` | `ev_47d888ff93f924ab11cee9bcb76e454ad358eb95f58a7161fa14c6944b1c185e` |
| `E-ge-logic` | inspect_android_method | `GameEngine.logicUpdate` | `ev_bd4f0bb46a4108e645390561682b633b319d78d813f6e64aac9cf2cc80fa2772` |
| `E-refs-ge` | trace_android_references | callers of `GameEngine.logicUpdate` (1, complete) | `ev_2f560d44fda504177c9f39f1b1ae0ed128b1460dcac53e7510374242695478fc` |
| `E-refs-game` | trace_android_references | callers of `Game.logicUpdate` (0 static) | `ev_d809386798da8c303fefa88ca080c58a3dd12ad027b4fb3a5e16efef5a6e094b` |
| `E-Time` | inspect_android_class | `com.dchoc.idead.Time` | `ev_3ba0cc354b6cc96284be8b61e4c810698c71eb988fef8bc52e736162da05ee6e` |
| `E-Timing` | inspect_android_class | `com.dchoc.idead.Timing` | `ev_521bf837e9e19073b10a7ab77edba73f21dd9ffcffae2eef4c5988aa44feeb37` |
| `E-Tuner` | inspect_android_class | `com.dchoc.idead.tuner.Tuner` | `ev_72ab7969db17e1afa97edc11f580f6217a35f366a441f88f30b29d2e05257383` |
| `E-ServletsMgr` | inspect_android_class | `idead.servlets.ServletsManager` | `ev_80b85b6f6ab91ce00a0a72d8bcb7e8969784d2dcb480a034b7db9e4d0ba8715d` |
| `E-ServletReq` | inspect_android_class | `idead.servlets.ServletRequest` | `ev_af316f136f171e362ade1b41b7b2a28993642e328457b95ad1eced1e92c40605` |
| `E-Servlets` | inspect_android_class | `idead.servlets.Servlets` | `ev_72270808bd160b4363fa0bf9253f59f1ad6af17f4c48ae574184fcf1534307c2` |

## Static-analysis limits

These apply to everything above:

- The APK was never executed. Decompiled code shows what the code says, not what happened at runtime.
- Calls through interfaces or reflection don't show up as static references. That is why `Game.logicUpdate` has
  no static callers.
- APK signatures were not verified, and the native AllJoyn libraries were not analyzed.
