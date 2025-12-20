import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Papers & Publications</CardTitle>
        </CardHeader>
        <CardContent>0</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Courses</CardTitle>
        </CardHeader>
        <CardContent>0</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Blogs</CardTitle>
        </CardHeader>
        <CardContent>0</CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
