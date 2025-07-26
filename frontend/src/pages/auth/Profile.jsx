import React from "react";

const Profile = ({ user }) => {
  if (!user) return <p>Loading...</p>;

  return (
    <div className="card shadow p-4 m-4">
      <h4 className="mb-4">Profil Pengguna</h4>
      <table className="table">
        <tbody>
          <tr>
            <th>Nama</th>
            <td>{user.name}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>{user.email}</td>
          </tr>
          <tr>
            <th>Nomor HP</th>
            <td>{user.phone}</td>
          </tr>
          <tr>
            <th>Alamat</th>
            <td>{user.address}</td>
          </tr>
          <tr>
            <th>Role</th>
            <td className="text-capitalize">{user.role}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Profile;
