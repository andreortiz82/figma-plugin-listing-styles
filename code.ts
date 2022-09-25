const localPaintStyles = figma.getLocalPaintStyles()
const nodes: SceneNode[] = [];

// MAIN PLUGIN CODE
async function main(): Promise<string | undefined> {
  // Roboto Regular is the font that objects will be created with by default in
  // Figma. We need to wait for fonts to load before creating text using them.
  await figma.loadFontAsync({ family: "Roboto", style: "Regular" })
  const outputWrapper = figma.createFrame();
  outputWrapper.layoutMode = "VERTICAL";
  outputWrapper.primaryAxisSizingMode = "AUTO";
  outputWrapper.counterAxisSizingMode = "AUTO";
  outputWrapper.paddingBottom = 8;
  outputWrapper.paddingLeft = 8;
  outputWrapper.paddingRight = 8;
  outputWrapper.paddingTop = 8;

  for (let i = 0; i < localPaintStyles.length; i++) {
    console.log(localPaintStyles[i].name)
    console.log(localPaintStyles[i].paints)

    const keyText = figma.createText()
    const text = figma.createText()
    await figma.loadFontAsync(keyText.fontName)
    await figma.loadFontAsync(text.fontName)
    text.characters = localPaintStyles[i].name
    keyText.characters = localPaintStyles[i].type;

    // Set bigger font size and red color
    keyText.fontSize = 16
    keyText.x = 0
    keyText.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]
    text.fontSize = 16
    text.x = 0
    text.fills = [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }]

    const rect = figma.createRectangle();
    rect.cornerRadius = 4;
    rect.x = i * 24;
    rect.resize(16, 16)
    rect.fills = [{ type: 'SOLID', color: localPaintStyles[i].paints[0].color }];

    const tokenWrapper = figma.createFrame();
    tokenWrapper.layoutMode = "HORIZONTAL";
    tokenWrapper.layoutPositioning = "AUTO";
    tokenWrapper.primaryAxisSizingMode = "AUTO";
    tokenWrapper.counterAxisSizingMode = "AUTO";
    tokenWrapper.primaryAxisAlignItems = "CENTER";
    tokenWrapper.counterAxisAlignItems = "CENTER";
    tokenWrapper.itemSpacing = 8;
    tokenWrapper.paddingBottom = 8;
    tokenWrapper.paddingLeft = 8;
    tokenWrapper.paddingRight = 8;
    tokenWrapper.paddingTop = 8;

    tokenWrapper.appendChild(rect)
    tokenWrapper.appendChild(keyText)
    tokenWrapper.appendChild(text)
    outputWrapper.appendChild(tokenWrapper)
  }

  figma.currentPage.appendChild(outputWrapper);
  nodes.push(outputWrapper);

  figma.currentPage.selection = nodes;
  figma.viewport.scrollAndZoomIntoView(nodes);
}

main().then((message: string | undefined) => {
  figma.closePlugin("Thanks!")
})