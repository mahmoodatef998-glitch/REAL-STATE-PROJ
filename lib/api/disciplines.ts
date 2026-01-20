import disciplines from '../mock-data/disciplines.json' assert { type: 'json' };

/**
 * Get list of disciplines (static mock data)
 */
export async function getDisciplines() {
    // In a real API this would be a fetch call; here we just return the static JSON.
    return disciplines;
}
