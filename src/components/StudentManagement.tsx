
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Edit, Trash2, Phone, User } from 'lucide-react';
import { useSchool } from '../contexts/SchoolContext';
import { toast } from 'sonner';

interface StudentManagementProps {
  showAddForm: boolean;
  onCloseAddForm: () => void;
}

const StudentManagement = ({ showAddForm, onCloseAddForm }: StudentManagementProps) => {
  const [newStudent, setNewStudent] = useState({
    name: '',
    class: '',
    parentPhone: '',
    parentName: ''
  });
  const [selectedClass, setSelectedClass] = useState('');
  const [editingStudent, setEditingStudent] = useState<any>(null);

  const { students, classes, addStudent, updateStudent, deleteStudent, getStudentsByClass } = useSchool();

  const handleAddStudent = () => {
    if (!newStudent.name.trim() || !newStudent.class || !newStudent.parentPhone.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate Indian phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(newStudent.parentPhone)) {
      toast.error('Please enter a valid Indian phone number');
      return;
    }

    addStudent({
      name: newStudent.name,
      class: newStudent.class,
      parentPhone: newStudent.parentPhone,
      parentName: newStudent.parentName || `Parent of ${newStudent.name}`
    });

    setNewStudent({ name: '', class: '', parentPhone: '', parentName: '' });
    onCloseAddForm();
    toast.success('Student added successfully');
  };

  const handleEditStudent = (student: any) => {
    setEditingStudent(student);
  };

  const handleUpdateStudent = () => {
    if (!editingStudent) return;

    updateStudent(editingStudent.id, {
      name: editingStudent.name,
      class: editingStudent.class,
      parentPhone: editingStudent.parentPhone,
      parentName: editingStudent.parentName
    });

    setEditingStudent(null);
    toast.success('Student updated successfully');
  };

  const handleDeleteStudent = (studentId: string) => {
    deleteStudent(studentId);
    toast.success('Student deleted successfully');
  };

  const displayStudents = selectedClass 
    ? getStudentsByClass(selectedClass) 
    : students;

  return (
    <div className="space-y-6">
      {/* Add Student Dialog */}
      <Dialog open={showAddForm} onOpenChange={onCloseAddForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Enter student details and parent contact information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="student-name">Student Name *</Label>
              <Input
                id="student-name"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                placeholder="Enter student's full name"
              />
            </div>
            <div>
              <Label htmlFor="student-class">Class *</Label>
              <Select value={newStudent.class} onValueChange={(value) => setNewStudent({ ...newStudent, class: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((classInfo) => (
                    <SelectItem key={classInfo.id} value={classInfo.name}>
                      {classInfo.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="parent-phone">Parent's Phone Number *</Label>
              <Input
                id="parent-phone"
                value={newStudent.parentPhone}
                onChange={(e) => setNewStudent({ ...newStudent, parentPhone: e.target.value })}
                placeholder="Enter 10-digit phone number"
                maxLength={10}
              />
            </div>
            <div>
              <Label htmlFor="parent-name">Parent's Name</Label>
              <Input
                id="parent-name"
                value={newStudent.parentName}
                onChange={(e) => setNewStudent({ ...newStudent, parentName: e.target.value })}
                placeholder="Enter parent's name (optional)"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddStudent} className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
              <Button variant="outline" onClick={onCloseAddForm} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>
              Update student details and parent contact information
            </DialogDescription>
          </DialogHeader>
          {editingStudent && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-student-name">Student Name</Label>
                <Input
                  id="edit-student-name"
                  value={editingStudent.name}
                  onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-student-class">Class</Label>
                <Select value={editingStudent.class} onValueChange={(value) => setEditingStudent({ ...editingStudent, class: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((classInfo) => (
                      <SelectItem key={classInfo.id} value={classInfo.name}>
                        {classInfo.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-parent-phone">Parent's Phone Number</Label>
                <Input
                  id="edit-parent-phone"
                  value={editingStudent.parentPhone}
                  onChange={(e) => setEditingStudent({ ...editingStudent, parentPhone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-parent-name">Parent's Name</Label>
                <Input
                  id="edit-parent-name"
                  value={editingStudent.parentName}
                  onChange={(e) => setEditingStudent({ ...editingStudent, parentName: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdateStudent} className="flex-1">
                  Update Student
                </Button>
                <Button variant="outline" onClick={() => setEditingStudent(null)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Student List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Student Records</CardTitle>
              <CardDescription>
                Manage student information and parent contacts
              </CardDescription>
            </div>
            <div className="w-64">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Classes</SelectItem>
                  {classes.map((classInfo) => (
                    <SelectItem key={classInfo.id} value={classInfo.name}>
                      {classInfo.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Parent Contact</TableHead>
                  <TableHead>Parent Name</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {student.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{student.class}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {student.parentPhone}
                      </div>
                    </TableCell>
                    <TableCell>{student.parentName}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditStudent(student)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteStudent(student.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {displayStudents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No students found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentManagement;
