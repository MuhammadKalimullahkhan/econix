import React, { useEffect, useState } from "react";
import { Home, Search, User } from "react-feather";
import RequiredLogin from "./shared/required-login";
import { useLocation, useNavigate } from "react-router-dom";

const BottomNavBar: React.FC = () => {
  const [activeTab, setActiveTab] = useState("home");

  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: "profile", slug: "/profile", icon: User, label: "Profile" },
    { id: "home", slug: "/", icon: Home, label: "Home" },
    { id: "search", slug: "/search", icon: Search, label: "Search" },
  ];

  useEffect(() => {
    const currentPath = navItems.filter(
      (item) => item.slug === location.pathname
    );

    setActiveTab(currentPath.length > 0 ? currentPath[0].id : "home");
    return () => {};
  }, [location]);

  const handleNavClick = (id: string, slug: string) => {
    setActiveTab(id);
    // Add navigation logic here
    navigate(slug);
  };

  return (
    <RequiredLogin>
      <nav
        style={{ zIndex: 999999999999 }}
        className="mt-auto sticky p-2 bottom-0 left-0 right-0 border-t bg-white text-foreground transition-all duration-300 ease-in-out"
      >
        <ul className="flex justify-around items-center">
          {navItems.map((item) => (
            <li key={item.id} className="flex-1">
              <button
                onClick={() => handleNavClick(item.id, item.slug)}
                className={`w-full flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary ${
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground font-bold"
                    : "hover:bg-primary/70"
                }`}
                aria-label={item.label}
              >
                <item.icon size={14} className="text-2xl mb-1" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </RequiredLogin>
  );
};

export default BottomNavBar;
