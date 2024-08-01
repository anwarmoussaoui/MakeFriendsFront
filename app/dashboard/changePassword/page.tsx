'use client'
import axios from "axios";
import React, { useState } from "react";
import Swal from "sweetalert2";
export default function ChangePassword() {
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
            if(confirmPassword !== newPassword){
                Swal.fire("Password doesn't match");
            }else{
                
                const email=localStorage.getItem('email');
                alert(email);
                const response = await axios.post('http://localhost:8080/api/public/changePassword', {
                    email,
                    password,
                    newPassword,
                  });
                  Swal.fire(response.data);

            }
    }
    return (
        
        <div className="bg-base-200 min-h-screen flex items-center justify-center">
        <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
                <h1 className="card-title text-center">Change Password</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Old Password</span>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your old password"
                            className="input input-bordered"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">New Password</span>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your new password"
                            className="input input-bordered"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-control mt-4">
                        <label className="label">
                            <span className="label-text">Confirm Password</span>
                        </label>
                        <input
                            type="password"
                            placeholder="Confirm your new password"
                            className="input input-bordered"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-control mt-6">
                        <button type="submit" className="btn btn-primary">Change Password</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    )}

