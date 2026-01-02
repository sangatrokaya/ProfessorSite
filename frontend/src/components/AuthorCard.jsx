import { Link } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import { Avatar } from "./ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

const AuthorCard = ({ author }) => {
  if (!author) return null;

  return (
    <Card>
      <CardContent className="flex gap-4 p-6">
        {/* Avatar */}
        <Avatar>
          <AvatarFallback>{author.name?.charAt(0)}</AvatarFallback>
        </Avatar>

        {/* Info */}
        <div className="space-y-1">
          <h4 className="font-semibold">{author.name}</h4>
          <p className="text-sm text-muted-foreground">{author.designation}</p>
          <p className="text-sm">{author.bio}</p>

          <Link to="/about" className="text-sm underline text-muted-foreground">
            Read More →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthorCard;
