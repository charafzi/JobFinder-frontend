import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import TopNavBar from "../components/TopNavBar";
import {MultipleSelectList, SelectList} from "react-native-dropdown-select-list";
import React, {useCallback, useState} from "react";
import {StyleSheet} from "react-native";
import {Color} from "../constants/Color";
import Slider from "rn-range-slider";
import LoadingIndicator from "../components/LoadingIndicator";
import {useDispatch, useSelector} from "react-redux";
import {searchOffres} from "../redux/slices/offres/searchOffresThunk";
import {useNavigation} from "@react-navigation/native";

const FilterScreen = () =>{
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const {
        keyword,
        typeContrat,
        salaryMin,
        salaryMax,
        page,
        size,
        sortBy,
        sortDirection,
    }
    = useSelector((state)=>state.offres.params)
    const [selectedContractType, setSelectedContractType] = useState([]);
    const [sort,setSort] = useState("");
    const [SortDirection,setSortDirection] = useState("");
    const [low, setLow] = useState(0);
    const [high, setHigh] = useState(100);
    const contractType = [
        {key:'1', value:'CDD'},
        {key:'2', value:'CDI'},
        {key:'3', value:'Freelance'},
        {key:'4', value:'Stage'}
    ]
    const SortBy = [
        {key:'1', value:'Publication Date'},
        {key:'2', value:'Salary'}
    ]
    const SortByDirection = [
        {key:'1', value:'ASC'},
        {key:'2', value:'DESC'}
    ]

    const handleValueChange = useCallback((low, high) => {
        setLow(low);
        setHigh(high);
    }, []);

    const Thumb = () => <View style={styles.thumb} />;
    const Rail = () => <View style={styles.rail} />;
    const RailSelected = () => <View style={styles.railSelected} />;
    const Notch = () => <View style={styles.notch} />;

    const handleApplyFilter = () =>{
        let sortByConverted = '';

        switch (sort){
            case 'Publication Date':
                sortByConverted = 'PUB_DATE';
                break;
            case 'Salary':
                sortByConverted= 'SALARY';
                break;
            default:
                sortByConverted = 'PUB_DATE';
        }
         dispatch(searchOffres({
             keyword,
             typeContrat: selectedContractType.length ? selectedContractType : null,
             salaryMin: low,
             salaryMax: high,
             page: 0,
             size,
             sortBy: sortByConverted,
             sortDirection: SortDirection || "ASC",
         }))
        navigation.goBack();

    }

    return(
        <ScrollView>
            <TopNavBar
                title={"Filter"}
                showProfile={false}
                showNotification={false}
            >
            </TopNavBar>
            <View style={styles.container}>
                <Text style={styles.title}>Contract Type</Text>
                <MultipleSelectList
                    setSelected={(val) => setSelectedContractType(val)}
                    data={contractType}
                    save="value"
                    label="Contract Type"
                    checkBoxStyles={styles.checkBox}
                    badgeStyles={styles.badge}
                    boxStyles={styles.list}
                    dropdownStyles={styles.list}
                />
                <Text style={styles.title}>Salary</Text>
                <View style={styles.sliderContainer}>
                    <Slider
                        min={0}
                        max={50000}
                        step={100}
                        renderThumb={Thumb}
                        renderRail={Rail}
                        renderRailSelected={RailSelected}
                        renderNotch={Notch}
                        onValueChanged={handleValueChange}
                        floatingLabel={true}
                    />
                    <View style={styles.valueContainer}>
                        <Text style={styles.valueText}>{low} DH</Text>
                        <Text style={styles.valueText}>{high} DH</Text>
                    </View>
                </View>
                <Text style={styles.title}>Sort By</Text>
                <SelectList
                    setSelected={(val) => setSort(val)}
                    data={SortBy}
                    save="value"
                    checkBoxStyles={styles.checkBox}
                    badgeStyles={styles.badge}
                    boxStyles={styles.list}
                    dropdownStyles={styles.list}
                />
                <Text style={styles.title}>Sort Direction</Text>
                <SelectList
                    setSelected={(val) => setSortDirection(val)}
                    data={SortByDirection}
                    save="value"
                    checkBoxStyles={styles.checkBox}
                    boxStyles={styles.list}
                    dropdownStyles={styles.list}
                />
            </View>
            <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApplyFilter}
            >
                <View style={styles.applyButtonContent}>
                    <Text style={styles.applyButtonText}>APPLY NOW</Text>
                </View>
            </TouchableOpacity>
        </ScrollView>
    );

}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        display: "flex",
        flexDirection: "column",
        justifyContent:"flex-start"
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: Color.text,
        marginBottom: 5,
        marginVertical: 5
    },
    checkBox:{
        borderColor: Color.secondary
    },
    badge: {
        color: Color.icon,
        backgroundColor: Color.secondary
    },
    list:{
        marginHorizontal: 20,
        marginVertical: 10
    },
    sliderContainer: {
        height: 100,
        justifyContent: "center",
        backgroundColor: "transparent",
        marginHorizontal: 20,
        marginVertical: 10
    },
    thumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#fff",
        borderColor: Color.secondary,
        borderWidth: 2,
    },
    rail: {
        flex: 1,
        height: 4,
        borderRadius: 2,
        backgroundColor: "grey",
    },
    railSelected: {
        height: 4,
        backgroundColor: Color.secondary,
        borderRadius: 2,
    },
    labelContainer: {
        position: 'absolute',
        bottom: -30,
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    labelLeft: {
        left: 0,
    },
    labelRight: {
        right: 0,
    },
    labelText: {
        color: Color.text,
        fontSize: 14,
        fontWeight: 'bold',
    },
    valueContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 20,
    },
    valueText: {
        fontSize: 12,
        fontWeight: "bold",
        color: Color.text,
    },
    notch: {
        width: 20,
        height: 20,
        color: Color.text,
        backgroundColor: "transparent",
        borderColor: Color.secondary,
        borderRadius: 15
    },
    applyButton: {
        backgroundColor: Color.selectedbutton,
        marginHorizontal: 50,
        marginVertical: 20,
        paddingHorizontal: 60,
        paddingVertical: 20,
        borderRadius: 10,
        height: 60,
        justifyContent: "center",
    },
    applyButtonText: {
        color: "#ffffff",
        fontWeight: "700",
        fontSize: 14,
    },
    applyButtonContent: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,
    },
})

export default FilterScreen;