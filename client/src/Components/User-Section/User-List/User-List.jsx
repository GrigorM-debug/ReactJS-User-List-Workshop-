import THead from "../../THead/THead";
import UserListItem from "../User-List-Item/User-List-Item";

export default function UserList({
    users,
    onDelete,
    showUserDetails,
    onEdit, 
    onSort,
    sortOrder,
    sortField
}) {
    return (
        <div className="table-wrapper">
            <table className="table">
                <THead 
                    onSort={onSort} 
                    sortField={sortField}
                    sortOrder={sortOrder}
                />
                <tbody>
                    {users.map(user => (
                        <UserListItem
                            key={user._id}
                            user={user}
                            onDelete={onDelete}
                            showUserDetails={showUserDetails}
                            onEdit={onEdit} 
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}