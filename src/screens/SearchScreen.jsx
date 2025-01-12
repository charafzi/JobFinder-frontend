import {View} from "react-native";
import TopNavBar from "../components/TopNavBar";
import JobCardSearchPreview from "../components/JobCardSearchPreview";

const SearchScreen = ()=>{
    return (
        <View>
            <TopNavBar
                theme={"purple"}
                showSearchBar={true}
            ></TopNavBar>
            <JobCardSearchPreview></JobCardSearchPreview>
        </View>
    )
}

export default SearchScreen;