import { SymbolView } from "expo-symbols";

export default function IconStatic({ name, style, spacer, tintColor }) {
  return (
    <SymbolView
      name={name}
      style={[style, { marginLeft: spacer }]}
      type="monochrome"
      tintColor={!tintColor ? "#262828" : tintColor}
    />
  );
}
