import HomeOutline from "../../public/svgs/HomeOutline";
import HomeSolid from "../../public/svgs/HomeSolid";
import LifeListOutline from "../../public/svgs/LifeListOutline";
import ExploreOutline from "../../public/svgs/ExploreOutline";
import ProfileOutline from "../../public/svgs/ProfileOutline";
import ProfileSolid from "../../public/svgs/ProfileSolid";
import CameraIcon from "../../public/svgs/CameraIcon";

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
        <HomeOutline color={color} />
      ) : (
        <ExploreOutline color={color} />
      );
    case "Camera":
      return focused ? <CameraIcon /> : <HomeSolid color={color} />;
    case "LifeList":
      return focused ? (
        <HomeOutline color={color} />
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
