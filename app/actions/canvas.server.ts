import { createCanvas, loadImage, registerFont, Canvas } from "canvas";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";

import type { TextItem } from "~/types";
import { drawCanvas } from "./draw.canvas";

export async function generateCanvas(textItems: TextItem[]) {
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext("2d");

  const tempDir =
    (Deno.env.get("TEMP") || Deno.env.get("TMP") || "/tmp") + "/fonts";

  const fileUrl =
    "https://pub-03e47c61c6054e65ba7a63608956c85c.r2.dev/fonts/Antiga/Antiga-Regular.ttf";

  const filePath = `${tempDir}/Antiga-Regular.ttf`;

  // Check if the file already exists
  if (!existsSync(filePath)) {
    try {
      await mkdir(tempDir, { recursive: true });
    } catch (e) {}

    // Fetch the file and write it to disk
    const response = await fetch(fileUrl);
    const fileContent = await response.arrayBuffer();
    await Deno.writeFile(filePath, new Uint8Array(fileContent));
    console.log("File downloaded and saved.");
  } else {
    console.log("File already exists.");
  }

  registerFont(filePath, {
    family: "Antiga",
  });

  const img = await loadImage("public/tree.jpg");

  canvas.width = img.width;
  canvas.height = img.height;

  drawCanvas(ctx, img, textItems);

  return canvas.toBuffer("image/jpeg");
}
