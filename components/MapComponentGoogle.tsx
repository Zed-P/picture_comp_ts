import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';
import 'leaflet.markercluster';

const defaultMarkerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface Photo {
  latitude: number;
  longitude: number;
  url: string;
  title: string;
  description: string;
  competition: string;
  team: string;
}

const MarkerCluster = ({ markers, selectedTeam }: { markers: Photo[], selectedTeam: string }) => {
  const map = useMap();

  useEffect(() => {
    const markerClusterGroup = L.markerClusterGroup();

    markers.forEach((marker) => {
      const icon = selectedTeam === '' ? defaultMarkerIcon : defaultMarkerIcon;
      if (marker.latitude !== undefined && marker.longitude !== undefined) {
        const leafletMarker = L.marker([marker.latitude, marker.longitude], { icon })
          .bindPopup(`
            <div>
              <img src="${marker.url}" alt="${marker.title}" style="width:100px;height:auto;" />
              <p><strong>${marker.title}</strong></p>
              <p>${marker.description}</p>
              ${selectedTeam === '' ? `<p>Koordináta: (${marker.latitude.toFixed(5)}, ${marker.longitude.toFixed(5)})</p>` : ''}
              <p>Verseny: ${marker.competition}</p>
              <p>Csapat: ${marker.team}</p>
            </div>
          `);
        markerClusterGroup.addLayer(leafletMarker);
      } else {
        console.warn(`Invalid coordinates for marker: ${marker.title}`);
      }
    });

    map.addLayer(markerClusterGroup);

    return () => {
      map.removeLayer(markerClusterGroup);
    };
  }, [map, markers, selectedTeam]);

  return null;
};

const MapComponentGoogle = () => {
  const [locations, setLocations] = useState<Photo[]>([]);
  const [competitions, setCompetitions] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [compareTeams, setCompareTeams] = useState(false);
  const [team1, setTeam1] = useState<string>('');
  const [team2, setTeam2] = useState<string>('');

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(`/api/locations`);
        const data = await response.json();
        if (data.success && data.data) {
          setLocations(data.data.locations);
          setCompetitions(data.data.competitions);
        } else {
          console.error('Nem sikerült a lekérés: Az adatok nem megfelelő formátumúak vagy üresek.');
        }
      } catch (error) {
        console.error('Nem sikerült a lekérés:', error);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    if (selectedCompetition) {
      const teamsInCompetition = locations
        .filter((location) => location.competition === selectedCompetition)
        .map((location) => location.team);
      setTeams([...new Set(teamsInCompetition)]);
      setSelectedTeam('');
      setTeam1('');
      setTeam2('');
    } else {
      setTeams([]);
    }
  }, [selectedCompetition, locations]);

  const filteredLocations = selectedCompetition
    ? locations.filter((location) => location.competition === selectedCompetition)
    : locations;

  const teamFilteredLocations = selectedTeam
    ? filteredLocations.filter((location) => location.team === selectedTeam)
    : filteredLocations;

  return (
    <>
      <div className="flex flex-col items-center p-4 bg-gray-100 rounded-md shadow-md mb-6">
        <label className="mb-4 w-full text-center text-lg font-semibold">
          Válassz versenyt:
          <select
            value={selectedCompetition}
            onChange={(e) => setSelectedCompetition(e.target.value)}
            className="mt-2 w-full p-2 border border-gray-200 rounded-md"
          >
            <option value="">all</option>
            {competitions.map((competition, index) => (
              <option key={index} value={competition}>
                {competition}
              </option>
            ))}
          </select>
        </label>
        {selectedCompetition && (
          <>
            <label className="w-full text-center text-lg font-semibold">
              Válassz csapatot:
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="mt-2 w-full p-2 border border-gray-200 rounded-md"
              >
                <option value="">all</option>
                {teams.map((team, index) => (
                  <option key={index} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </label>
            <label className="w-full text-center text-lg font-semibold mt-4">
              <input
                type="checkbox"
                checked={compareTeams}
                onChange={() => setCompareTeams(!compareTeams)}
                className="mr-2"
              />
              2 csapat összehasonlítása
              {compareTeams && (
                <>
                  <select
                    value={team1}
                    onChange={(e) => setTeam1(e.target.value)}
                    className="mt-2 w-full p-2 border border-gray-200 rounded-md"
                  >
                    <option value="">Első csapat</option>
                    {teams.map((team, index) => (
                      <option key={index} value={team}>
                        {team}
                      </option>
                    ))}
                  </select>
                  <select
                    value={team2}
                    onChange={(e) => setTeam2(e.target.value)}
                    className="mt-2 w-full p-2 border border-gray-200 rounded-md"
                  >
                    <option value="">Második csapat</option>
                    {teams.map((team, index) => (
                      <option key={index} value={team}>
                        {team}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </label>
          </>
        )}
      </div>

      <MapContainer
        center={[20, 0]}
        zoom={3}
        style={{ width: '100%', height: compareTeams ? 'auto' : '700px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MarkerCluster
          markers={compareTeams ? filteredLocations.filter((loc) => loc.team === team1 || loc.team === team2) : teamFilteredLocations}
          selectedTeam={selectedTeam}
        />
      </MapContainer>
    </>
  );
};

export default MapComponentGoogle;
