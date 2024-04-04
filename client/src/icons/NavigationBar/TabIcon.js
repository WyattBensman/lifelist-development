import CameraIcon from "./CameraIcon";
import ExploreOutline from "./ExploreOutline";
import ExploreSolid from "./ExploreSolid";
import HomeOutline from "./HomeOutline";
import HomeSolid from "./HomeSolid";
import LifeListOutline from "./LifeListOutline";
import LifeListSolid from "./LifeListSolid";
import ProfileSolid from "./ProfileSolid";
import ProfileOutline from "./ProfileOutline";

export default function TabIcon({ focused, color, routeName }) {
  switch (routeName) {
    case "Home":
      return focused ? (
        <HomeSolid color={color} />
      ) : (
        <HomeOutline color={color} />
      );
    case "Explore":
      return focused ? (
        <ExploreSolid color={color} />
      ) : (
        <ExploreOutline color={color} />
      );
    case "Camera":
      return <CameraIcon />;
    case "LifeList":
      return focused ? (
        <LifeListSolid color={color} />
      ) : (
        <LifeListOutline color={color} />
      );
    case "Profile":
      return focused ? (
        <ProfileSolid color={color} />
      ) : (
        <ProfileOutline color={color} />
      );
    default:
      return null;
  }
}
