import TabNav from "@/src/components/TabNav";

export default function layout() {
    return (
            <TabNav tabs={[{ name: "Agregar", path: "add" }, { name: "Lista", path: "index" },{ name: "Editar", path: "edit" }]} init={"index"}/>)}