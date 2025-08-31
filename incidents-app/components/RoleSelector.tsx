// RoleSelector.tsx
import { useState } from "react";

export default function RoleSelector({ onRoleChange }: { onRoleChange: (role: string) => void }) {
  const [role, setRole] = useState("DRIVER");

  return (
    <div className="mb-4">
      <label className="font-medium">Select Role: </label>
      <select
        value={role}
        onChange={(e) => {
          setRole(e.target.value);
          onRoleChange(e.target.value);
        }}
        className="border rounded px-3 py-2 ml-2"
      >
        <option value="ADMIN">Admin</option>
        <option value="DRIVER">Driver</option>
        <option value="FLEET_MANAGER">Fleet Manager</option>
      </select>
    </div>
  );
}
