import THead from "../../THead/THead";
import UserListItem from "../User-List-Item/User-List-Item";

export default function UserList({
    users
}) {
    return (
        <div className="table-wrapper">

            <table className="table">
                <THead/>
                <tbody>
                    {users.map(user => (
                        <UserListItem
                            key={user._id}
                            user={user}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};