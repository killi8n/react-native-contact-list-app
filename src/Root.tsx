import React, { useState } from 'react';
import { AsyncStorage, Button, FlatList, Image, Linking, SafeAreaView, Text, View } from 'react-native';
import ContactList, { Contact } from "react-native-contact-list"

const PERMISSION_REQUEST_BEFORE_KEY = "PERMISSION_REQUEST_BEFORE"

const Root: React.FC = () => {
    const [contactList, setContactList] = useState<Contact[]>([])
    const { checkPermission, getContactList, requestPermission } = ContactList
    const handlePress = async () => {
        try {
            const permissionResult = await checkPermission()
            if (permissionResult === "authorized") {
                await handleContactList()
            } else {
                const permissionResult = await requestPermission()
                if (permissionResult === "authorized") {
                    await handleContactList()
                } else {
                    const requestedPermissionStorageItem = await AsyncStorage.getItem(PERMISSION_REQUEST_BEFORE_KEY)
                    const isRequestedBefore = requestedPermissionStorageItem === "true"
                    if (isRequestedBefore) {
                        await Linking.openSettings()
                    }
                }
                await AsyncStorage.setItem(PERMISSION_REQUEST_BEFORE_KEY, "true")
            }
        } catch (e) {
            console.error(e)
        }
    }

    const handleContactList = async () => {
        try {
            const contactList = await getContactList()
            setContactList(contactList)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Button title="GET CONTACT LIST" onPress={handlePress} />
            {
                contactList.length > 0 && (
                    <FlatList
                        data={contactList}
                        renderItem={({ item }) => {
                            return (
                                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                    <Image
                                        style={{ width: 50, height: 50, borderRadius: 25 }}
                                        source={{
                                            uri: item.thumbnailPath
                                        }}
                                    />
                                    <View style={{ display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: 30 }}>
                                        <Text>{item.displayName}</Text>
                                        <Text>{item.phoneNumber}</Text>
                                    </View>
                                </View>
                            )
                        }}
                        keyExtractor={(item, index) => `${index}-${item.displayName}`}
                    />
                )
            }
        </SafeAreaView>
    );
};

export default Root;