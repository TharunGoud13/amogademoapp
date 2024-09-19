"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const SelectLanguage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  return (
    <div>
      <Select
        value={selectedLanguage}
        onValueChange={(value) => setSelectedLanguage(value)}
      >
        <SelectTrigger className="w-[180px] bg-secondary">
          <SelectValue placeholder="Select Country" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            <SelectItem value="de">German</SelectItem>
            <SelectItem value="me">Bahasa Melayu</SelectItem>
            <SelectItem value="te">Telugu</SelectItem>
            <SelectItem value="hi">Hindi</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectLanguage;
