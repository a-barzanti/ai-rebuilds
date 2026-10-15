# Online dependencies

Everything the game talks to over the network, and what the rebuild should do instead. Evidence IDs are listed in
[evidence.md](evidence.md).

Tags: **[obs]** observed in REA output · **[sh]** observed with ordinary tools · **[inf]** inferred · **[?]** unknown

## Declared in the manifest

**[obs]** (`E-package`)

- **Permissions:** Google Play billing, phone state, internet, vibrate, wake lock, network/Wi-Fi state, Wi-Fi
  multicast and external storage.
- **Components:** Facebook login, PayPal MEP, Fortumo (carrier billing), Google Play in-app billing
  (`BillingService`/`BillingReceiver`), Tapjoy offer walls/video, Flurry ads, a Transpera video-ad intent,
  AllJoyn (`AllJoynService`, `BundleDaemonService`) and local notifications.

## The game's own server ("servlets")

**[sh]** Text entry 2 in `l0_0` holds the base URL `http://ec2-184-73-12-168.compute-1.amazonaws.com:8080/dead`.
**[inf]** This was an Amazon EC2 host used while the game was live. It is almost certainly gone. We did not
contact it.

**[obs]** `ServletsManager` keeps a request queue (add, remove, process) and has its own `logicUpdate(dt)`
(`E-ServletsMgr`). **[inf]** Requests move forward once per logic update. Each request
(`ServletRequest`) has a service name, URL parameters, an optional "add user info" flag, and a signature
(`SIGNATURE_PREFIX`/`SIGNATURE_LENGTH`) (`E-ServletReq`). **[inf]** Responses are XML, since there is a
`ServletRequestWithXml` class and the engine has an XML parser. **[obs]** The signature is an MD5 hash of
the parameter string, the session ID and a fixed key from the text table. Before a session exists it's an MD5 of
the key alone (`E-sr-execute`). Requests also carry the game version and platform. This only matters to someone
building a compatible server, which is out of scope.

**[obs]** Services (`E-Servlets`):

| Service | Purpose (from its name and parameters) | Rebuild |
| ------- | -------------------------------------- | ------- |
| `CreateNewSession`, `GetAccountInformation`, `UpdateAccountInformation`, `BindPlatformAccount`, `UpdateDeviceToken` | Account, session, cloud backup. Parameters include `gamefield` and `missions`, so the server kept a copy of the save. | Local profile only. Optional export/import of the save file. |
| `GetTimers` | **[obs]** Social timers only: neighbor-hire countdown, hires left and per-day maximum, neighbor action resets, gift cooldowns (`E-gt-endElement`). Requested only after account information, hiring or gifting (`E-refs-timers`). | Not needed. **[obs]** The game's timestamp is the device clock (`E-timestamp`). |
| `CollectDailyRewards` | Daily bonus | Compute it locally from the local clock. |
| `VisitNeighbor`, `AddNeighborRequest(s)`, `AcceptNeighborRequest`, `AddNeighborActions`, `AcceptNeighborActions`, `HireNeighbor` | Visiting friends and helping them | The built-in neighbor **Rob** (type 2514) loads locally and is kept. Other neighbors are out of scope at first. |
| `SendGift`, `AcceptGift`, `RequestGift` | Gifts | Out of scope at first. Could be replaced by a local "gift box". |
| `SetOption` | Settings sync | Local. |

## Third-party services

None of these are needed for gameplay. **[inf]** In the rebuild they become stubs:

| Service | Classes | Rebuild |
| ------- | ------- | ------- |
| Facebook | `com.facebook.*`, `toolkit.AndroidFacebookConnection`, `idead.social.SocialFacebook` | Removed. The engine already has `EmptyFacebookConnection`, a do-nothing implementation that shows how a missing connection was handled. |
| Payments | Google IAB, Fortumo, PayPal, `toolkit.AndroidPaymentManager`, `com.dchoc.Purchase*` | Removed. Premium currency is earned in-game, or granted by a setting. |
| Ads and offers | Tapjoy, Transpera, Flurry ads | Removed. |
| Analytics / CRM | Flurry, `amagicbox` (`CRMSession`, `trackEvent`) | Removed. |
| Twitter, Game Center | `SocialTwitter`, `SocialGameCenter` | Removed. |
| AllJoyn local multiplayer | `AlljoynBridge`/`Connection`/`SyncInterface`, `AllJoynService` | Out of scope. Could become a WebRTC visit feature much later. |

## Answered questions

- **Does the first launch need the server?** No. See *Offline behavior* in [architecture.md](architecture.md).
  The original APK should therefore start offline, which makes it usable for recording reference behavior.
- **Does `GetTimers` change game rules?** Only social ones (hiring neighbors, gifts). See the table above.
- **Was any art only on the asset server?** Only HD variants: 133 bundles. See
  [sprites-and-animations.md](sprites-and-animations.md#server-only-bundles).
