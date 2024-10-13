import { Link } from "react-router-dom"
import AdminSidebar from "../../components/admin/AdminSidebar"
import { Skeleton } from "../../components/loader"
import { FaPlus } from "react-icons/fa6"
import TableHOC from "../../components/admin/TableHOC"
import { ReactElement, useEffect, useState } from "react"
import { Column } from "react-table"
import { AllDiscountResponse, CustomError } from "../../types/api-types"
import { useFetchData } from "6pp"
import { RootState, server } from "../../redux/store"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"


interface DataType {
    code: string;
    amount: number;
    _id: string;
    action: ReactElement;
  }

const Discount = () => {

    const { user } = useSelector((state: RootState) => state.userReducer);

    const {data, loading: isLoading, error} = useFetchData<AllDiscountResponse>(`${server}/api/v1/payment/coupon/all?id=${user?._id}`, "discount-codes")

    const [rows, setRows] = useState<DataType[]>([]);

    const columns: Column<DataType>[] = [
        {
            Header: "Id",
            accessor: "_id",
        },
        {
          Header: "Code",
          accessor: "code",
        },
        {
          Header: "Amount",
          accessor: "amount",
        },
        {
          Header: "Action",
          accessor: "action",
        },
      ];

    const Table = TableHOC<DataType>(
        columns,
        rows,
        "dashboard-product-box",
        "Products",
        rows.length > 6
      );

      if (error) {
        toast.error(error);
      }
    
      useEffect(() => {
        if (data)
          setRows(
            data.coupons.map((i) => ({
              _id: i._id,
              code: i.code,
              amount: i.amount,
              action: <Link to={`/admin/discount/${i._id}`}>Manage</Link>,
            }))
          );
      }, [data]);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton length={20}/> :  <Table/>}</main>
      <Link to="/admin/discount/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  )
}

export default Discount
