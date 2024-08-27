"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllImapDetails } from "@/lib/store/actions";
import { FC, useEffect, useState } from "react";
import { connect } from "react-redux";
import { FaTrash } from "react-icons/fa6";
import { CREATE_IMAP_DETAILS_URL } from "@/constants/envConfig";
import { toast } from "../ui/use-toast";
import { IoMdEye } from "react-icons/io";
import { IoEyeOffOutline } from "react-icons/io5";

const EmailDetails: FC<any> = ({
  getAllImapDetailsResponse,
  getAllImapDetails,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const maskedPassword = (string: string) => {
    return string.replace(/./g, "*");
  };

  useEffect(() => {
    getAllImapDetails();
  }, [getAllImapDetails]);

  const handleDelete = async (id: string | number) => {
    const myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
    );
    const requestOptions: any = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };
    const response = await fetch(
      `${CREATE_IMAP_DETAILS_URL}?user_catalog_data_id=eq.${id}`,
      requestOptions
    );
    if (response.ok) {
      toast({
        description: "IMAP details deleted successfully",
        variant: "default",
      });
      getAllImapDetails();
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Password</TableHead>
          <TableHead>Host</TableHead>
          <TableHead>Port</TableHead>
          <TableHead className="text-right">TLS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {getAllImapDetailsResponse &&
          getAllImapDetailsResponse?.length > 0 &&
          getAllImapDetailsResponse.map((item: any) => (
            <TableRow key={item.user_catalog_data_id}>
              <TableCell className="font-medium">
                {item.data_response.split(" ")[0]}
              </TableCell>
              <TableCell>
                {showPassword
                  ? item.data_response.split(" ")[1]
                  : maskedPassword(item.data_response.split(" ")[1])}
              </TableCell>

              <TableCell>{item.data_response.split(" ")[2]}</TableCell>
              <TableCell>{item.data_response.split(" ")[3]}</TableCell>
              <TableCell className="text-right">
                {item.data_response.split(" ")[4]}
              </TableCell>
              <TableCell>
                <FaTrash
                  className="cursor-pointer text-gray-500"
                  onClick={() => handleDelete(item.user_catalog_data_id)}
                />
              </TableCell>
              <TableCell>
                {showPassword ? (
                  <IoEyeOffOutline
                    onClick={togglePassword}
                    className="text-[20px] cursor-pointer"
                  />
                ) : (
                  <IoMdEye
                    onClick={togglePassword}
                    className="text-[20px] cursor-pointer"
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

const mapStateToProps = (state: any) => ({
  getAllImapDetailsResponse: state.getAllImapDetailsResponse,
});

const mapDispatchToProps = {
  getAllImapDetails,
};

export default connect(mapStateToProps, mapDispatchToProps)(EmailDetails);
