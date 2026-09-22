import type { SoundPreset } from '@/features/sound/types';

export const officialSoundPresets: SoundPreset[] = [
  { id: 'deep-focus', title: 'Margem silenciosa', description: 'Ruído rosa e uma chuva quase distante para sustentar capítulos longos.', mood: 'Concentração', durationLabel: 'Sessão aberta', channels: { pink_noise: 30, rain_glass: 22 } },
  { id: 'rainy-library', title: 'Biblioteca na chuva', description: 'Vidros molhados, lareira baixa e o rumor contido de uma sala antiga.', mood: 'Clássico', durationLabel: '45 min sugeridos', channels: { rain_glass: 62, fireplace: 24, brown_noise: 12 } },
  { id: 'night-train', title: 'Capítulo no trem', description: 'Graves contínuos, trilhos amortecidos e teclas que acompanham a escrita.', mood: 'Movimento', durationLabel: '25 min sugeridos', channels: { night_train: 58, brown_noise: 20, typewriter_keys: 14 } },
  { id: 'coastal-draft', title: 'Rascunho à beira-mar', description: 'Maré lenta e ar profundo para cenas contemplativas.', mood: 'Amplitude', durationLabel: 'Sessão aberta', channels: { ocean_tide: 66, brown_noise: 14 } },
  { id: 'late-cafe', title: 'Café depois das onze', description: 'Sala distante, chuva leve e uma máquina de escrever discreta.', mood: 'Urbano', durationLabel: '50 min sugeridos', channels: { cafe_room: 52, rain_glass: 18, typewriter_keys: 10 } },
  { id: 'forest-after-rain', title: 'Bosque depois da chuva', description: 'Folhagem noturna, água residual e uma base grave quase imperceptível.', mood: 'Orgânico', durationLabel: '35 min sugeridos', channels: { forest_night: 56, rain_glass: 20, brown_noise: 10 } },
];
