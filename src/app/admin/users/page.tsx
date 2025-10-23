"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type User = {
	id: number;
	name: string;
	email: string;
	role: string;
	status: 'pending' | 'active' | 'locked';
};

const MOCK_USERS: User[] = [
	{ id: 1, name: 'Nguyen Van A', email: 'a@example.com', role: 'user', status: 'pending' },
	{ id: 2, name: 'Tran Thi B', email: 'b@example.com', role: 'user', status: 'active' },
	{ id: 3, name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active' },
	{ id: 4, name: 'Le Van C', email: 'c@example.com', role: 'user', status: 'locked' },
];

const AdminUsersPage: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Simulate loading/mock fetch
		setTimeout(() => {
			setUsers(MOCK_USERS);
			setLoading(false);
		}, 400);
	}, []);

	const approveUser = (id: number) => {
		setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'active' } : u));
	};

	const toggleLock = (id: number) => {
		setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'locked' ? 'active' : 'locked' } : u));
	};

	return (
		<div className='w-full max-w-full'>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-semibold">Quản lý người dùng (Mock)</h1>
				<Link href="/admin" className="text-sm text-gray-600">Back to admin</Link>
			</div>

			{loading ? (
				<div>Loading users...</div>
			) : (
				<div className="overflow-x-auto bg-white rounded-lg border">
					<table className="w-full text-left">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-4 py-3">ID</th>
								<th className="px-4 py-3">Name</th>
								<th className="px-4 py-3">Email</th>
								<th className="px-4 py-3">Role</th>
								<th className="px-4 py-3">Status</th>
								<th className="px-4 py-3">Actions</th>
							</tr>
						</thead>
						<tbody>
							{users.map(u => (
								<tr key={u.id} className="border-t">
									<td className="px-4 py-3">{u.id}</td>
									<td className="px-4 py-3">{u.name}</td>
									<td className="px-4 py-3">{u.email}</td>
									<td className="px-4 py-3">{u.role}</td>
									<td className="px-4 py-3">
										<span className={`inline-block px-2 py-1 rounded text-sm ${u.status === 'active' ? 'bg-green-100 text-green-700' : u.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
											{u.status}
										</span>
									</td>
									<td className="px-4 py-3 space-x-2">
										{u.status === 'pending' && (
											<button onClick={() => approveUser(u.id)} className="px-3 py-1 bg-green-500 text-white rounded">Approve</button>
										)}
										{u.role !== 'admin' && (
											<button onClick={() => toggleLock(u.id)} className={`px-3 py-1 rounded ${u.status === 'locked' ? 'bg-green-400 text-white' : 'bg-red-500 text-white'}`}>
												{u.status === 'locked' ? 'Unlock' : 'Lock'}
											</button>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default AdminUsersPage;

