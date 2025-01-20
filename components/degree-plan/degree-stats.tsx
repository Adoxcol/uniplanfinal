'use client';

import { Card } from '@/components/ui/card';
import { Progress } from '../ui/progress';
import { Course } from '@/types/types'; // Import shared types
import { Input } from '@/components/ui/input'; // Import Input component
import { useState } from 'react'; // Import useState for managing maxCredits
import { Label } from '@radix-ui/react-label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateGpa, universityGradingSystems } from '@/utils/gradingUtils'; // Import utility functions

interface DegreeStatsProps {
  courses?: Course[];
  initialMaxCredits?: number; // Allow initial maxCredits to be passed as a prop
  onMaxCreditsChange?: (maxCredits: number) => void; // Callback for when maxCredits changes
}

export function DegreeStats({ 
  courses = [], 
  initialMaxCredits = 120, 
  onMaxCreditsChange 
}: DegreeStatsProps) {
  const [maxCredits, setMaxCredits] = useState(initialMaxCredits); // Local state for maxCredits
  const [selectedUniversity, setSelectedUniversity] = useState<keyof typeof universityGradingSystems>('NSU'); // Default to NSU

  // Calculate total credits
  const totalCredits = courses.reduce((acc, course) => acc + course.credits, 0);

  // Calculate GPA based on the selected university
  const gpa = calculateGpa(courses, selectedUniversity);

  // Calculate completion percentage
  const completionPercentage = Math.round((totalCredits / maxCredits) * 100);

  // Handle maxCredits change
  const handleMaxCreditsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setMaxCredits(value);
      if (onMaxCreditsChange) {
        onMaxCreditsChange(value); // Notify parent component of the change
      }
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Total Credits Card */}
      <Card className="p-4">
        <h3 className="font-semibold text-sm">Total Credits</h3>
        <div className="mt-2">
          <div className="text-2xl font-bold">{totalCredits}/{maxCredits}</div>
          <Progress value={(totalCredits / maxCredits) * 100} className="mt-2" />
        </div>
        <div className="mt-4">
          <Label htmlFor="maxCredits">Set Max Credits</Label>
          <Input
            id="maxCredits"
            type="number"
            value={maxCredits}
            onChange={handleMaxCreditsChange}
            min="1"
            className="w-full mt-2"
          />
        </div>
      </Card>

      {/* Current GPA Card */}
      <Card className="p-4">
        <h3 className="font-semibold text-sm">Current GPA</h3>
        <div className="mt-2">
          <div className="text-2xl font-bold">{gpa}</div>
          <Progress value={(parseFloat(gpa) / 4.0) * 100} className="mt-2" />
        </div>
        {/* University Selection Dropdown */}
        <div className="mt-4">
          <Label htmlFor="university">Select University</Label>
          <Select
            value={selectedUniversity}
            onValueChange={(value) => setSelectedUniversity(value as keyof typeof universityGradingSystems)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select University" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(universityGradingSystems).map((university) => (
                <SelectItem key={university} value={university}>
                  {university}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Completion Card */}
      <Card className="p-4">
        <h3 className="font-semibold text-sm">Completion</h3>
        <div className="mt-2">
          <div className="text-2xl font-bold">{completionPercentage}%</div>
          <Progress value={completionPercentage} className="mt-2" />
        </div>
      </Card>
    </div>
  );
}