const allLocalStyles = [
  figma.getLocalPaintStyles(),
  figma.getLocalTextStyles(),
  figma.getLocalEffectStyles(),
  figma.getLocalGridStyles()
]

const nodes: SceneNode[] = [];

const createSwatch = (style) => {
  const rect = figma.createFrame();
  const size = 24;
  rect.cornerRadius = 4;
  rect.resize(size, size);

  switch (style.type) {
    case 'PAINT':
      // code block
      rect.fillStyleId = style.id
      break;
    case 'EFFECT':
      rect.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]
      rect.effectStyleId = style.id
      break;
    case 'TEXT':
      rect.fills = [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }]
      rect.strokeWeight = 2;
      const mark = createLabel({ value: 'T' });
      mark.textCase = "UPPER";
      mark.textAlignHorizontal = "CENTER";
      mark.textAlignVertical = "CENTER";
      mark.textAutoResize = "WIDTH_AND_HEIGHT";
      mark.resize(size, size);
      rect.appendChild(mark)
      break;
    default:
      rect.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]
  }
  return rect;
}

const createWrapper = ({ layout, padding }) => {
  const wrapper = figma.createFrame();
  wrapper.layoutMode = layout;
  wrapper.primaryAxisSizingMode = 'AUTO';
  wrapper.counterAxisSizingMode = 'AUTO';
  wrapper.paddingTop = padding.t;
  wrapper.paddingRight = padding.r;
  wrapper.paddingBottom = padding.b;
  wrapper.paddingLeft = padding.l;
  return wrapper;
}

const createLabel = ({ value }) => {
  const label = figma.createText()
  label.fontName = { family: "Menlo", style: "Regular" }
  label.characters = value;
  label.fontSize = 16;
  label.x = 0;
  label.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]
  return label;
}

async function main() {
  await figma.loadFontAsync({ family: "Menlo", style: "Regular" });

  const groupWrapper = createWrapper({ layout: 'VERTICAL', padding: { t: 8, r: 8, b: 8, l: 8 } })
  allLocalStyles.forEach(styleGroup => {
    styleGroup.forEach(style => {
      const styleWrapper = createWrapper({ layout: 'HORIZONTAL', padding: { t: 8, r: 8, b: 8, l: 8 } })
      const swatch = createSwatch(style)
      const label = createLabel({ value: style.name })
      styleWrapper.itemSpacing = 8;
      styleWrapper.name = style.name;
      styleWrapper.appendChild(swatch);
      styleWrapper.appendChild(label);
      groupWrapper.appendChild(styleWrapper);
      // console.log(style.id, style.name, style.type, style.description);
    });
  });

  figma.currentPage.appendChild(groupWrapper);
  nodes.push(groupWrapper);
  figma.currentPage.selection = nodes;
  figma.viewport.scrollAndZoomIntoView(nodes);
}

main().then(() => {
  figma.closePlugin("Thanks!");
})