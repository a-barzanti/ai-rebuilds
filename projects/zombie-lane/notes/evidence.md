# Evidence index

REA evidence behind the notes in this folder. The evidence records themselves are kept locally by whoever ran the
analysis and are **not committed**, because they contain decompiled code. Re-run the same operation on an APK
with the same SHA-256 to reproduce them.

- **Target:** `zombie-lane-1-0-33-multi-android.apk`, SHA-256
  `39b93f6f5409a3e9f84a47efdd23e3067333117bc5edad6c27887091ebda0ad6`
- **Tools:** REA `rea-agents@6.4.0` (CLI and MCP), JADX provider `jadx-headless-mcp` 0.7.1 (JAR SHA-256
  `6e5eacf5…ff75`, source revision `5844800a`), Temurin JDK 26
- **Date:** 2026-10-14 (first pass), 2026-10-15 (second pass)

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

### Second pass (2026-10-15)

| Ref | Operation | Subject | Evidence ID |
| --- | --------- | ------- | ----------- |
| `E-ge-load` | inspect_android_method | `GameEngine.load` (startup steps) | `ev_fcf00b7f15889c8f97ee852ce32cb0afdd3cdde948af1b1e796daeba0b4d8c91` |
| `E-sr-execute` | inspect_android_method | `ServletRequest.execute` (async send, signature) | `ev_942998be0f050761faae5fd9274e9af8cac11cae9e83ddf04ba75ea92c40ea6b` |
| `E-cns-response` | inspect_android_method | `CreateNewSession.processResponse` | `ev_f48f4b843bbd831962749d3db65f48267a6bee362532c1197ce18e97672a2da7` |
| `E-cns-offline` | inspect_android_method | `CreateNewSession.showOfflineMode` | `ev_b8b433b3d69a1b6041f435b6a9e3e021167994242958f4bbb5693adee5721490` |
| `E-cns-endElement` | inspect_android_method | `CreateNewSession.endElement` (session ID, user ID) | `ev_bb7ae9f874ce98b9e98906714e6870863a87ffebe8a435e4e33826a3300b942b` |
| `E-refs-offline` | trace_android_references | callers of `showOfflineMode` (1, complete) | `ev_8c50067d0561721ecb2c48b41aa4a52dfdcc65b4f21eb91e72efc599238e6928` |
| `E-hud-callback` | inspect_android_method | `HUDFoldable.callback` | `ev_3622db25c8f11f1f9d01222c86ea65a2f8a61848eec47c25b1799c75ed50b2a6` |
| `E-gt-endElement` | inspect_android_method | `GetTimers.endElement` (overload 1) | `ev_5e596962f2e6a3eebf3688a3ada84959470e6339103ba0424b89cef524dfe39b` |
| `E-refs-timers` | trace_android_references | callers of `GameEngine.setGetTimers` (3, complete) | `ev_0d42b629aaed4df134094099f1a036dfa0182b07d78395f44549a2db27ff6f82` |
| `E-timestamp` | inspect_android_method | `Timing.getTimestamp` | `ev_11744324863253484951fbbd8e03b1d71172e5e06e40b6d3652a37ab8d7f2f37` |
| `E-ResourceIDs` | inspect_android_class | `toolkit.ResourceIDs` (21,015 field names) | `ev_286dd94c81b5546373b9a9dd555390e133eede840f5e26d84f6169bfc02a74d2` |
| `E-Tuner-init` | inspect_android_method | `Tuner.init` (GAMESETUP field order) | `ev_7456282320a179de54dc005f74872a0abd05a9bebbb09e193dbf4dee88508a99` |
| `E-readIntArray` | inspect_android_method | `ToolkitHelpers.readIntArray` | `ev_ae51eaf398e4a46bfffd0da323e6736f8b3a5fc93ba10751ffc4d2ac32ddaaa6` |
| `E-textureInit` | inspect_android_method | `DavinciUtilities.textureInit` | `ev_ea4b9a6ffefed7def7162ee195d98e5aea4d706ab7f05c49d1123d5ce7e46d15` |
| `E-readBundle` | inspect_android_method | `DavinciUtilities.readTextureBundleData` | `ev_0e1e2d0ef9f1232c0f27335eed43dab607adb0e277c5d24b5b66ca49192d07e8` |
| `E-readTexture` | inspect_android_method | `DavinciUtilities.readTextureData` | `ev_0b3287443a0d576f530f689acc121cfe06a231131c27e4d7cff37f1d3eead56a` |
| `E-loadTextureImage` | inspect_android_method | `DavinciUtilities.loadTextureImage` (image reference bits) | `ev_b284bc1af77a02f414ca2df13c4d3cce0280b201c693c187d8aef42dff4c79e2` |
| `E-versionText` | inspect_android_method | `DavinciUtilities.getVersionText` | `ev_1cf623a067f8825ced1bee2d3f4b8c4c1dd3aaac47e046841dd01aaa625013a8` |
| `E-createAnimation` | inspect_android_method | `Animation.createAnimation` (link entries, variant choice) | `ev_9681f112d97d56465fb0eaa3a0d732651fdc940de58d0941e4e99327d4d8bdd9` |
| `E-initAnimation` | inspect_android_method | `Animation.initAnimation` (header, durations, timeline) | `ev_1964238e262aeef55a2da94007aa83bba0e8e7ad7425a5b0e6a041ab5a6fa48b` |
| `E-isFrameRef` | inspect_android_method | `Animation.isFrameReference` | `ev_5346cfc205eff4401829d20367aef70ae7d0751b14503449be63cf48b2b5c257` |
| `E-loadFrame` | inspect_android_method | `AnimationFrame.loadFrameData` (renderables) | `ev_a3410f752c8da2eac8e50c2bfe58262936fb60fb41a1f7634f5d214770655a82` |
| `E-timelineLoad` | inspect_android_method | `TimelineChannel.load` | `ev_1311bdd6f7d7da7f7c59eb9c78e82055dfeafe40e29f7ba50533ab2ec38eddae` |
| `E-timelineValue` | inspect_android_method | `Animation.getTimelineValue` | `ev_e82acc0a6facc28cfa445fded8172bfa6fb05f70b62b7fbcb81bade211ef2974` |
| `E-serverAssets` | inspect_android_method | `ServerAssetLoader.init` | `ev_9ccd2163f4b6d95df79073664461d88d37450726a63a8143c1b8c08266066b85` |
| `E-bundleLoadFile` | inspect_android_method | `ServerBundle.loadFile` | `ev_799bd6b7141bd638e1eacd7de71e9b114fc14189669af696458583b3af2a7414` |

### Third pass: drawing (2026-10-15)

| Ref | Operation | Subject | Evidence ID |
| --- | --------- | ------- | ----------- |
| `E-spriteDraw` | inspect_android_method | `SpriteObject.draw` (overload 1) | `ev_3ba1b4d1c98d2cb25e154d09b26d0fed4c95b74ce4705816a0a3a6e783739b01` |
| `E-spriteUpdate` | inspect_android_method | `SpriteObject.logicUpdate` | `ev_44a59cfef2526b8461f5fa3a156f433ad8aed2b84e40c3584169f1b7bc2d9d68` |
| `E-timelineX` | inspect_android_method | `SpriteObject.getTimelineX` | `ev_66c035bc457bc23383de8324880dde5c715132695e9fab96d12bf6c66b675d57` |
| `E-drawAligned` | inspect_android_method | `SpriteObject.drawAligned` | `ev_17cb87bc023d870ac4bbd07effdba7fba56f98f76e31c866d8f957c541aa9395` |
| `E-animDoDraw` | inspect_android_method | `Animation.doDraw` | `ev_e843eebca1a9ef3bc4572c10ddff1045a3ff6365744209e1edd60ac39f7927b8` |
| `E-frameDoDraw` | inspect_android_method | `AnimationFrame.doDraw` | `ev_88d1dcdb6a2a9470a5e1ea8efb78a0701d37df7c035f298e646c232083fe6c51` |
| `E-timelineValue2` | inspect_android_method | `TimelineChannel.getValue` | `ev_8b9a60a138a2115b928995c0b89338a60487ebeeac601073ddcef242e71b0c90` |
| `E-neutral` | inspect_android_method | `TimelineChannel.getNeutralValue` | `ev_3fd89fb9c3e67e81eebde03bb8e63319337cd62f4b50d8f01cdaee9479304640` |
| `E-ease` | inspect_android_method | `TimelineChannel.easeInOutQuad` (and `easeInQuad`, `easeOutQuad`) | `ev_b4ba3f1f347209b3044881aad4a1d5f3cc7fa23cbf36c546cd658246ae43fdb5` |
| `E-lerp` | inspect_android_method | `DavinciUtilities.interpolateValue` | `ev_2b48a8f9178630e115a8fb355a55d4a46b8283ae1c6818eca3409494999a70ee` |
| `E-drawTexture` | inspect_android_method | `OGL.drawTexture` (overload 1) | `ev_ee692db24483b058c16c8a776cf07d84e4e326ab282e521cb1de49a57abaf117` |
| `E-angle` | inspect_android_method | `OGLParameters.setAngleInt` | `ev_112712e97bed4f53042720ad067048c2743f817fa761cccc3498cfa7ea7c3e38` |
| `E-scale` | inspect_android_method | `OGLParameters.setScaleInt` | `ev_fec421f63a6e033c93b94805813ec640dde47ad2bd29faa2495daf2dcf00a7f9` |
| `E-blending` | inspect_android_method | `OGL.setBlending` | `ev_997c0ada717101af5200005d1013828a8afbacb0b740383cbdb37db029c4be32` |
| `E-colorRGB` | inspect_android_method | `OGL.setColorRGB` | `ev_65036ed0ed86b27e5aae39fc186444c3c3afd2038aa7141df40ff7f211c74ce0` |

## Static-analysis limits

These apply to everything above:

- The APK was never executed. Decompiled code shows what the code says, not what happened at runtime.
- Calls through interfaces or reflection don't show up as static references. That is why `Game.logicUpdate` has
  no static callers.
- APK signatures were not verified, and the native AllJoyn libraries were not analyzed.
- Constant **values** (resource IDs, enum values) are not part of REA's class output. They were read straight from
  `classes.dex` with `tools/dex-consts.ts`, so they are tagged **[sh]**.
- Format layouts marked **[sh]** were checked by parsing every entry with the scripts in [../tools](../tools/).
