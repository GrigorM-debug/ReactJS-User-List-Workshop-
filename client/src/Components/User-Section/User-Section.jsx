import Search from "../Search/Search";
import Pagination from "../Pagination/Pagination";
import UserList from "./User-List/User-List";
import { useState, useEffect } from "react";
import NoUsersAddedYetContainer from "../NoUsersAddedYet/NoUsersAddedYetContainer";
import FetchingError from "../FetchingError/FetchingError";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import CreateEditUser from "./Create-Edit-User/Create-Edit-User";
import UserDelete from "./UserDelete/UserDelete";
import NotFound from "../NotFound/NotFound";
import UserDetails from "./UserDetails/UserDetails";

export default function UserSection() {
    const baseURL = 'http://localhost:3030/jsonstore';

    const [users, setUsers] = useState([]);
    const [showNoUsersYet, setShowNoUsersYet] = useState(false);
    const [showFetchError, setShowFetchError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showCreateEditUser, setShowCreateEditUser] = useState(false);
    const [showDeleteUserById, setShowDeleteUserById] = useState(null);
    const [showNoUsersFound, setShowNoUsersFound] = useState(false);
    const [showUserDetailsById, setShowUserDetailsById] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [searchCriteria, setSearchCriteria] = useState('');
    const [seachValue, setSearchValue] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${baseURL}/users`);
            const data = await response.json();
            const usersData = Object.values(data);

            if (usersData.length === 0) {
                setShowNoUsersYet(true);
            } else {
                setUsers(usersData);
            }
        } catch (error) {
            setShowFetchError(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddButtonClick = () => {
        setEditingUser(null);
        setShowCreateEditUser(true);
    };

    const handleCloseButtonClick = () => {
        setShowCreateEditUser(false);
    };

    const handleDeleteClick = (userId) => {
        setShowDeleteUserById(userId);
    };

    const handleCloseDelete = () => {
        setShowDeleteUserById(null);
    };

    const handleSubmitDelete = async () => {
        const userId = showDeleteUserById;
        setIsLoading(true);

        try {
            const response = await fetch(`${baseURL}/users/${userId}`);
            if (!response.ok) {
                if (response.status === 404) {
                    setShowNoUsersFound(true);
                    alert('User does not exist');
                    return;
                } else {
                    throw new Error('Network response was not ok');
                }
            }

            await fetch(`${baseURL}/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json'
                }
            });

            alert('User deleted successfully');
            setUsers((oldUsers) => oldUsers.filter((u) => u._id !== userId));
            setShowDeleteUserById(null);
        } catch (error) {
            alert('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditClick = (user) => {
        setShowCreateEditUser(true);
        setEditingUser(user)
    };


    const handleUserDetails = (userId) => {
        setShowUserDetailsById(userId);
    };

    const closeUserDetails = () => {
        setShowUserDetailsById(null);
    };

    const handleFormSubmit = async (userData) => {
        setIsLoading(true);
        try {
            if (editingUser) {
                const updatedUser = {
                    firstName: userData.firstName, 
                    lastName: userData.lastName,
                    email: userData.email,
                    phoneNumber: userData.phoneNumber,
                    imageUrl: userData.imageUrl,
                    createdAt: userData.createdAt,
                    updatedAt: new Date().toISOString(),
                    address: {
                        country: userData.country,
                        city: userData.city,
                        street: userData.street,
                        streetNumber: userData.streetNumber
                    }
                }

                await fetch(`${baseURL}/users/${editingUser._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedUser),
                });
            } else {
                const newUser = {
                    firstName: userData.firstName, 
                    lastName: userData.lastName,
                    email: userData.email,
                    phoneNumber: userData.phoneNumber,
                    imageUrl: userData.imageUrl,
                    createdAt: new Date().toISOString(),
                    updatedAt: null,
                    address: {
                        country: userData.country,
                        city: userData.city,
                        street: userData.street,
                        streetNumber: userData.streetNumber
                    }
                }
                await fetch(`${baseURL}/users`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newUser),
                });
            }
            await fetchUsers();
            setShowCreateEditUser(false);
        } catch (error) {
            console.error('Error submitting form:', error);
            setShowFetchError(true);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSelectedCriteriaSeach = (e) => {
        const criteria = e.target.value;

        setSearchCriteria(criteria);
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        
        setSearchValue(e.target.value);

        let filteredUsersArray = [];

        if(searchCriteria === 'firstName') {
            filteredUsersArray = users.filter(u => new RegExp(seachValue, 'i').test(u.firstName));
        } else if (searchCriteria === 'lastName') {
            filteredUsersArray = users.filter(u => new RegExp(seachValue, 'i').test(u.lastName));
        } else if (searchCriteria === 'email') {
            filteredUsersArray = users.filter(u => new RegExp(seachValue, 'i').test(u.email));
        } else if (searchCriteria === 'phone'){
            filteredUsersArray = users.filter(u => new RegExp(seachValue, 'i').test(u.phone));
        } 
        
        if(filteredUsersArray.length === 0) {
            setShowNoUsersFound(true);
        } else {
            setShowNoUsersFound(false);
        }

        console.log(filteredUsersArray)

        setUsers(filteredUsersArray);
    }

    const searchCloseButtonHandler = () => {
        setUsers(users)
        setSearchCriteria('');
        setSearchValue('');
    }

    const handleItemsPerPage = (e) => {
        setItemsPerPage(Number(e.target.value));
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    // Calculate indices for the current page
    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    return (
        <main className="main">
            <section className="card users-container">
                <Search 
                    handleSelectedCriteriaSeach={handleSelectedCriteriaSeach}
                    handleSearchSubmit={handleSearchSubmit}
                    selectedCriteria={searchCriteria}
                    seachValue={seachValue}
                    onClose={searchCloseButtonHandler}
                />
                
                {isLoading && <LoadingSpinner />}
                
                {showNoUsersYet && <NoUsersAddedYetContainer />}
                
                {showNoUsersFound && <NotFound />}
                
                {showFetchError && <FetchingError />}
                
                {showCreateEditUser && (
                    <CreateEditUser
                        user={editingUser}
                        onClose={handleCloseButtonClick}
                        onSubmit={handleFormSubmit}
                    />
                )}

                {showDeleteUserById && (
                    <UserDelete
                        onClose={handleCloseDelete}
                        onSubmit={handleSubmitDelete}
                    />
                )}

                {showUserDetailsById && (
                    <UserDetails
                        user={users.find((u) => u._id === showUserDetailsById)}
                        onClose={closeUserDetails}
                    />
                )}

                <UserList
                    users={currentUsers}
                    onDelete={handleDeleteClick}
                    onEdit={handleEditClick}
                    showUserDetails={handleUserDetails}
                />


                <button className="btn-add btn" onClick={handleAddButtonClick}>
                    Add new user
                </button>

                <Pagination 
                    handleItemsPerPage={handleItemsPerPage}
                    postPerPage={itemsPerPage}
                    length={users.length}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </section>
        </main>
    );
}
