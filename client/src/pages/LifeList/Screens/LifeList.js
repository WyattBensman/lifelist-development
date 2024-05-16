import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ActionModal from "../Popups/ActionsModal";
import BackArrowIcon from "../../../icons/Universal/BackArrowIcon";
import SearchIcon from "../Icons/SearchIcon";
import ListViewIcon from "../Icons/ListViewIcon";
import { headerStyles, layoutStyles } from "../../../styles";
import CategoryNavigator from "../Navigation/CategoryNavigator";
import { useAuth } from "../../../contexts/AuthContext";
import { useQuery } from "@apollo/client";
import { GET_USER_LIFELIST } from "../../../utils/queries/lifeListQueries";
import HeaderStack from "../../../components/Headers/HeaderStack";
import HeaderMain from "../../../components/Headers/HeaderMain";
import EditLifeListIcon from "../Icons/EditLifeListIcon";

export default function LifeList() {
  const { currentUser } = useAuth();
  const navigation = useNavigation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const { data, loading, error } = useQuery(GET_USER_LIFELIST, {
    variables: { userId: currentUser._id },
  });

  useEffect(() => {
    if (data) {
      setIsAdmin(true);
    }
  }, [data]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const lifeList = data.getUserLifeList;

  return (
    <>
      <View style={layoutStyles.wrapper}>
        {isAdmin ? (
          <HeaderMain
            titleComponent={
              <Text style={headerStyles.headerHeavy}>My LifeList</Text>
            }
            icon1={<SearchIcon />}
            icon2=<EditLifeListIcon onPress={() => setModalVisible(true)} />
            icon3={
              <ListViewIcon onPress={() => navigation.navigate("Listview")} />
            }
          />
        ) : (
          <HeaderStack
            arrow={<BackArrowIcon />}
            title={"LifeList"}
            button1={<ListViewIcon />}
            button2={<SearchIcon />}
          />
        )}
        <CategoryNavigator lifeList={lifeList} />
        <ActionModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      </View>
    </>
  );
}
