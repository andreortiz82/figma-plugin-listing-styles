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
      // rect.opacity = style.opacity
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
      rect.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0.45 }]
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

const typeLabelFormat = (valueType) => {
  switch (valueType) {
    case 'PAINT':
      return 'color:'
      break;
    case 'TEXT':
      return 'text:'
      break;
    case 'EFFECT':
      return 'effect:'
      break;
    default:
      return 'token:'
      break;
  }
}

async function main() {
  await figma.loadFontAsync({ family: "Menlo", style: "Regular" });
  await figma.loadFontAsync({ family: "Roboto", style: "Bold" });
  figma.skipInvisibleInstanceChildren = true;

  const groupWrapper = createWrapper({ layout: 'VERTICAL', padding: { t: 0, r: 0, b: 0, l: 0 } })
  const styleIds = []

  // const elements = figma.currentPage.findAll();
  const elements = figma.currentPage.findAllWithCriteria({ types: ['COMPONENT', 'COMPONENT_SET', 'INSTANCE', 'FRAME', 'TEXT', 'RECTANGLE', 'ELLIPSE'] });

  elements.map((el) => {
    styleIds.push(el.fillStyleId)
    styleIds.push(el.strokeStyleId)
    styleIds.push(el.effectStyleId)
    styleIds.push(el.textStyleId)
  })

  let uniqStyleIds = [...new Set(styleIds)];

  return { uniqStyleIds: uniqStyleIds, groupWrapper: groupWrapper }
}

main().then(({ uniqStyleIds, groupWrapper }) => {
  let jsonOutput = []
  const groupTitle = createLabel({ value: "Tokens" })
  groupTitle.fontName = { family: "Roboto", style: "Bold" }
  groupTitle.fontSize = 40;
  groupTitle.resize(200, 56);
  groupWrapper.appendChild(groupTitle);

  uniqStyleIds.filter((a) => a).map((style) => {
    const styleObject = figma.getStyleById(style);
    const styleWrapper = createWrapper({ layout: 'HORIZONTAL', padding: { t: 8, r: 8, b: 8, l: 8 } })
    const swatch = createSwatch(styleObject)
    const label = createLabel({ value: styleObject.name })
    const typeLabel = createLabel({ value: typeLabelFormat(styleObject.type) })
    const jsonToken = { name: styleObject.name type: styleObject.type, styleId: styleObject.id }
    jsonOutput.push(jsonToken)
    typeLabel.fills = [{ type: 'SOLID', color: { r: 0.45, g: 0.45, b: 0.45 } }]
    typeLabel.resize(70, 24)
    typeLabel.textAlignVertical = "CENTER";
    styleWrapper.itemSpacing = 8;
    styleWrapper.counterAxisAlignItems = "CENTER";
    styleWrapper.name = styleObject.name;
    styleWrapper.appendChild(swatch);
    styleWrapper.appendChild(typeLabel);
    styleWrapper.appendChild(label);
    groupWrapper.appendChild(styleWrapper);
  })

  figma.currentPage.appendChild(groupWrapper);
  nodes.push(groupWrapper);
  figma.currentPage.selection = nodes;
  figma.viewport.scrollAndZoomIntoView(nodes);
  // console.log(jsonOutput, JSON.stringify(jsonOutput));
  figma.closePlugin("Boom Tokens!");
})