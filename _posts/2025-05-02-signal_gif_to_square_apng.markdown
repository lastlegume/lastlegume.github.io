---
layout: post
title: Creating Compressed Square APNG files from GIFs  
date:   2025-05-02 1:00:00 -0500
category: Signal stickers
author: lastlegume
tags: cs signal stickers image_processing apng gif gifToApng
---

I started using Signal recently, so naturally, I started looking into how best to use it. [signalstickers.org](https://signalstickers.org/), which is a fantastic resource, caught my attention, and I got drawn into converting the Pokémon LINE stickers to a format usable by Signal for my personal use. As a result, I now have a new [Electron application](https://github.com/lastlegume/gifToSquareAPNG/releases/tag/v1.0.0) that will take in an input and output directory and convert all of the GIF files inside into square APNG smaller than a given size. As a result, this application does everything needed to create Signal stickers; just give it a directory (folder) with GIFs in it and an output directory, and it'll compress and convert the GIFs into square APNGs that can be uploaded into Signal. 

There is also some customization; you can choose the maximum size of the compressed GIFs (for technical reasons, you can't choose the max size of the APNG, but the APNG is usually much smaller than the GIF) and the amount it shrinks with each compression cycle. Also, you can choose to save the compressed square GIF files if needed.

I don't have any way to sign the exe file, so Windows will give some warning about protecting your device and say that it's not allowing the file to be opened for security reasons, but you can still run it by clicking "More Info" and "Run Anyway." You can see the exact source code below.

<a href="https://github.com/lastlegume/gifToSquareAPNG" class="btn btn-github" style = "float:left;"><span class="icon"></span>View on GitHub</a><br><br>

If you're (rightfully) worried about running an unsigned exe file, simply clone the repository, navigate to the directory the repository is in on the command line (in windows, this can be done by going to the folder in file explorer, right clicking, and choosing "Open in terminal"), and run ```npm install``` and then ```npm run start```. You will need to have [node.js](https://nodejs.org/en/download) installed to do this though. 

While writing this post, I went back to my [source](https://pokemonlinestickers.tumblr.com/) and discovered that this whole process was fruitless given that you can [just download LINE stickers in the format signal needs](https://ldjb.jp/full-resolution-line-sticker-images), but it was a good learning experience, and many animated LINE stickers are not square and could be too large for Signal, so the application still has some use.  

When I created my first set of stickers, I wrote an extension to download all of the img elements in the center pane of my [source](https://pokemonlinestickers.tumblr.com/), and then I wrote this script to convert them to APNGs. The original form was simply a command line tool, but I decided to polish and release it, during which I added the interface and compression. The hardest part of the process was definitely converting the many different GIFs to APNGs, so my application is an attempt to make that process easier for others in the future.
