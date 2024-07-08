export default function THead({
    onSort,
    sortField,
    sortOrder
}) {
    return (
        <thead>
                <tr>
                    <th>Image</th>
                    <th onClick={() => onSort('firstName')}>First Name {sortField === 'firstName' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                    <th onClick={() => onSort('lastName')}>Last Name {sortField === 'lastName' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                    <th onClick={() => onSort('email')}>Email {sortField === 'email' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                    <th onClick={() => onSort('phone')}>Phone {sortField === 'phone' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                    <th onClick={() => onSort('createdAt')}>Created {sortField === 'createdAt' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                    <th>Actions</th>
                </tr>
                </thead>
    );
};