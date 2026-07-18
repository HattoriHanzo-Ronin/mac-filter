import { withLayoutContext } from "expo-router";
// necesario instalar npx expo install @react-navigation/material-top-tabs react-native-pager-view
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Background from "./Background";

// creara un Tab superior
const Tab = withLayoutContext(createMaterialTopTabNavigator().Navigator);

// creara un tab navigation a traves de un array recibido mediante props
export default function layout(props: { tabs: { path: string, name: string }[], init: string }) {
    const safeArea = useSafeAreaInsets().top;
    return (
        <Background type="tab">
            <Tab initialRouteName={props.init}
                screenOptions={{
                    // se puede cambiar el color de activo o inactivo entre otras muchas cosas
                    tabBarActiveTintColor: "rgba(13, 134, 9, 0.99)", tabBarInactiveTintColor: "rgba(31, 44, 219, 0.42)", tabBarStyle: { paddingTop: safeArea, backgroundColor: "transparent" }
                }}>
                {props.tabs.map(item => <Tab.Screen name={item.path} options={{ title: item.name }} />)}
            </Tab>
        </Background>
    )
}