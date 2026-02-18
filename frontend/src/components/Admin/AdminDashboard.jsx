import DefaultSidebar from "./AdminSidebar"

export default function AdminDashboard(){
    return(
    <div style={{ display: "flex" }}>
      <DefaultSidebar />
      <div style={{ padding: "20px" }}>
        <h1>Admin Content</h1>
      </div>
    </div>
  );
}