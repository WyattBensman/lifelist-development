import { View, FlatList } from "react-native";
import { layoutStyles } from "../../../../styles";
import ListItemCard from "../../Cards/ListItemCard";

export default function AllExperiencesList({ lifeList, viewType, editMode }) {
  const filteredList = lifeList.experiences.filter(
    (exp) => exp.list === viewType
  );

  const renderExperience = ({ item }) => (
    <ListItemCard experience={item.experience} editMode={editMode} />
  );

  return (
    <View style={[layoutStyles.wrapper, layoutStyles.paddingTopSm]}>
      <FlatList
        data={filteredList}
        renderItem={renderExperience}
        keyExtractor={(item) => item._id}
        style={layoutStyles.paddingLeftXxs}
      />
    </View>
  );
}
