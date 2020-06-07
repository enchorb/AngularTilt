export interface TiltSettings {
  reverse?: boolean; // Reverse The Tilt Direction
  max?: number; // Max Tilt Rotation (degrees)
  perspective?: number; // Transform Perspective, Lower = More Extreme Tilt
  scale?: number; // Scale On Enter (1 = 100%)
  speed?: number; // Speed of the enter/exit transition
  transition?: boolean; // Set A Transition On Enter/Exit
  axis?: string; // Disable Axis, 'X' or 'Y'
  reset?: boolean; // Reset Tilt On Exit
  easing?: string; // Easing On Enter/Exit
  glare?: boolean; // Enable Glare Effect
  'max-glare'?: number; // Glare Opacity (1 = 100%)
  'glare-prerender'?: boolean; // False = Tilt Module Creates Glare, True = Custom Glare
  'mouse-event-element'?: string; // CSS-Selector/HTML-Element That Will Listen To Mouse Events for Tilt
  gyroscope?: boolean; // Enable Device Orientation Detection
  gyroscopeMinAngleX?: number, // Bottom Limit Of Device Angle On X-Axis, Left Border
  gyroscopeMaxAngleX?: number;  // Top Limit Of Device Angle On X-Axis, Right Border
  gyroscopeMinAngleY?: number; // Bottom Limit Of Device Angle On Y-Axis, Top Border
  gyroscopeMaxAngleY?: number; // Top Limit Of Device Angle On Y-Axis, Bottom Border
}
