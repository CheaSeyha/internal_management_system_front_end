import React from 'react'
import DataTable from '@/components/DataTable'
import { Edit } from 'lucide-react'
import { Trash } from 'lucide-react'

function DepartmentTable({ departments, loading, error }) {


    const formattedDepartments = departments.map(dep => ({
        id: dep.department_id,
        department_name: dep.department,
        positions: dep.positions.join(", "), // optional for display
    }));
    return (
        <div>
            <DataTable
                data={formattedDepartments}
                columns={[
                    { key: 'id', label: 'Department ID' },
                    { key: 'department_name', label: 'Department' },
                    {
                        key: 'positions',
                        label: 'Positions',
                        render: (value) => {
                          if (!value) return <span className="text-muted-foreground">—</span>;
                      
                          return (
                            <div className="flex flex-wrap gap-2">
                              {value.split(", ").map((pos, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 text-xs rounded-md bg-primary/10 text-primary"
                                >
                                  {pos}
                                </span>
                              ))}
                            </div>
                          );
                        },
                      }
                ]}
                actions={[
                    { label: 'Edit', icon: <Edit className="w-4 h-4" />, onClick: (row) => updateDepartment(row) },
                    { label: 'Delete', icon: <Trash className="w-4 h-4" />, onClick: (row) => deleteDepartment(row) },
                ]}
                loading={loading}
                showCheckbox={false}
            />

        </div>
    )
}

export default DepartmentTable