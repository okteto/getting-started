import React from "react";

export function UserProfile({ user }) {
  return (
    <div className="UserProfile">
      <div className="User">
        <div className="name">{user.name}</div>
        <div className="image"><img src={user.avatar} alt="profile" /></div>
      </div>
    </div>
  );
}
