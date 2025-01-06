import {View} from "react-native";
import {Search} from "../components";
import TopNavBar from "../components/TopNavBar";
import JobCardSearchPreview from "../components/JobCardSearchPreview";

const SearchScreen = ()=>{
    return (
        <View>
            <TopNavBar></TopNavBar>
            <JobCardSearchPreview></JobCardSearchPreview>
        </View>
    )
}

export default SearchScreen;