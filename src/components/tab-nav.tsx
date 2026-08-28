import { withLayoutContext } from "expo-router";
import { createMaterialTopTabNavigator } from "expo-router/js-top-tabs";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Tab = withLayoutContext(createMaterialTopTabNavigator().Navigator);

export default function Layout(props: { tabs: { path: string; name: string }[]; init: string }) {
    const safeArea = useSafeAreaInsets().top;
    return (
        <>
            <Tab
                initialRouteName={props.init}
                screenOptions={{
                    tabBarActiveTintColor: "rgba(13, 134, 9, 0.99)",
                    tabBarInactiveTintColor: "rgba(31, 44, 219, 0.42)",
                    tabBarStyle: { paddingTop: safeArea, backgroundColor: "transparent" }
                }}
            >
                {props.tabs.map((item) => (
                    <Tab.Screen key={item.path} name={item.path} options={{ title: item.name }} />
                ))}
            </Tab>
        </>
    );
}
