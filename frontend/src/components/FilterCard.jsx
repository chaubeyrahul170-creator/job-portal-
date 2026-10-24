import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "../../redux/jobSlice.js";
import { RotateCcw } from "lucide-react";

const filterData = [
  {
    filterType: "Location",
    array: ["Delhi NCR", "Noida", "Bangalore", "Hyderabad", "Pune", "Mumbai", "Remote"],
  },
  {
    filterType: "Industry",
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer", "Data Science"],
  },
  {
    filterType: "Salary (LPA)",
    array: ["0-5 LPA", "5-10 LPA", "10-20 LPA", "20+ LPA"],
  },
];

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const dispatch = useDispatch();

  const changeHandler = (value) => {
    setSelectedValue(value);
  };

  const clearFilterHandler = () => {
    setSelectedValue("");
    dispatch(setSearchedQuery(""));
  };

  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue, dispatch]);

  return (
    <div className="w-full bg-white p-4 rounded-xl shadow-md border border-gray-100">
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <h1 className="font-bold text-lg text-gray-900">Filter Jobs</h1>
        {selectedValue && (
          <Button
            onClick={clearFilterHandler}
            variant="ghost"
            size="sm"
            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-1 h-7 px-2"
          >
            <RotateCcw className="w-3 h-3" /> Clear
          </Button>
        )}
      </div>

      <RadioGroup value={selectedValue} onValueChange={changeHandler} className="mt-4 space-y-4">
        {filterData.map((data, index) => (
          <div key={index} className="space-y-2">
            <h2 className="font-semibold text-sm text-gray-800 uppercase tracking-wide">
              {data.filterType}
            </h2>
            <div className="space-y-1.5 pl-1">
              {data.array.map((item, idx) => {
                const itemId = `filter-${index}-${idx}`;
                return (
                  <div key={itemId} className="flex items-center space-x-2">
                    <RadioGroupItem value={item} id={itemId} />
                    <Label htmlFor={itemId} className="text-sm text-gray-600 cursor-pointer font-normal hover:text-gray-900">
                      {item}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FilterCard;
