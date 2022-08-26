## GGZ Cutscene Collection

This is the source code for [GGZ Cutscene Collection](https://chapel.itch.io/ggz), a VN-style implementation of the cutscenes of the defunct (mostly) mobile game *Guns Girl Z* (AKA *Houkai Gakuen 2*), the predecessor to *Honkai Impact 3rd*, by MiHoYo. Data for the cutscenes, including scripts and assets, were acquired from the [GGZ cutscene interpreter project](https://hg2.bluealice.xyz/), which is also a great way to experience these cutscenes as more of a normal webpage.

![Screenshot](https://img.itch.zone/aW1hZ2UvMTU5NzY1My85MzUyMTY3LnBuZw==/original/Tdi4xn.png)

### Building

Assets and data are not currently included in this source code, so even though the project can be built, it will not run. The assets and data are huge and I do not own them, so finding a way to package and distribute this content is something I will look into in the future. For now, while you can view the source code, you can't do a lot else with it.

### The Cutscene Interpreter and Engine

This project is essentially a stripped-down web-based visual novel engine. It reads script files and interprets the "instructions" to recreate the cutscenes from the game. There is potential to turn the basic engine into one that can arbitrarily read script files provided by users to make custom VN-like games, and this is an avenue I may explore in the future.

### Credits

Thank you to the [Hoyostans](https://hoyostans.be/) community for retranslating the game. If you helped in the retranslation effort and are not credited here, please contact me.
- Mister Spaceman
- Demonbanex
- Bun Bun
- Max
- Darkmiz

Open source software used:
- [Twine](https://twinery.org/)
- [Tweego](https://www.motoslave.net/tweego/)
- [SugarCube](https://www.motoslave.net/sugarcube/2/)

Art/assets/content provided by:
- [GGZ cutscene interpreter](https://hg2.bluealice.xyz/)