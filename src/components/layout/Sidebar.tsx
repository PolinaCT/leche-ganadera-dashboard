
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, List, Calendar, ChartBar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navigationItems = [
    { name: 'Inicio', path: '/', icon: Home },
    { name: 'Inventario', path: '/inventario', icon: List },
    { name: 'Partos', path: '/partos', icon: Calendar },
    { name: 'Producción', path: '/produccion', icon: ChartBar },
    { name: 'Reportes', path: '/reportes', icon: FileText },
  ];

  return (
    <div 
      className={cn(
        "bg-card border-r border-border transition-all duration-300 flex flex-col shadow-sm",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b">
        {!collapsed && (
          <h2 className="text-xl font-bold text-farm-blue">LecheGanadera</h2>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? "→" : "←"}
        </Button>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground font-medium" : ""
                )}
              >
                <item.icon size={20} className="shrink-0" />
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        {!collapsed && (
          <div className="text-xs text-muted-foreground">
            Sistema de gestión de ganado lechero
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
