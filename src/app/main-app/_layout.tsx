import TabNav from "@/src/components/tab-nav";

export default function Layout() {
    return (
        <TabNav
            tabs={[
                { name: "Agregar", path: "add" },
                { name: "Lista", path: "index" },
                { name: "Editar", path: "edit" }
            ]}
            init={"index"}
        />
    );
}
