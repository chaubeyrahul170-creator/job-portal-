import React, { useState, useEffect } from 'react';
import Navbar from './shared/Navbar';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useDispatch, useSelector } from 'react-redux';
import useGetAllCompanies from '@/hooks/useGetAllCompanies';
import { setSearchCompanyByText } from '../../redux/companySlice.js';
import { useNavigate } from 'react-router-dom';
import { MapPin, Globe, Briefcase } from 'lucide-react';

const StudentCompanyBrowse = () => {
  useGetAllCompanies();
  const [input, setInput] = useState('');
  const { companies, searchCompanyByText } = useSelector(store => store.company);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input, dispatch]);

  const filteredCompanies = companies?.filter((company) =>
    company.name.toLowerCase().includes(searchCompanyByText?.toLowerCase() || '')
  ) || [];

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Explore Companies</h1>
            <p className="text-gray-600 text-lg">Discover top companies and their opportunities</p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <Input
              type="text"
              placeholder="🔍 Search companies by name..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full px-6 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-300 text-base transition-all"
            />
            <p className="text-sm text-gray-500 mt-2">
              Found <span className="font-semibold text-purple-600">{filteredCompanies.length}</span> companies
            </p>
          </div>

          {/* Companies Grid */}
          {filteredCompanies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((company) => (
                <div
                  key={company._id}
                  onClick={() => navigate(`/admin/companies/${company._id}`)}
                  className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-100 overflow-hidden"
                >
                  {/* Company Card Header */}
                  <div className="h-32 bg-gradient-to-r from-purple-500 to-blue-500 relative">
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <div className="h-16 w-16 bg-white rounded-lg shadow-lg flex items-center justify-center">
                        <Briefcase className="h-8 w-8 text-purple-600" />
                      </div>
                    </div>
                  </div>

                  {/* Company Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {company.name}
                    </h3>

                    {company.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {company.description}
                      </p>
                    )}

                    {/* Location */}
                    {company.location && (
                      <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                        <MapPin className="h-4 w-4 text-red-500" />
                        <span>{company.location}</span>
                      </div>
                    )}

                    {/* Website */}
                    {company.website && (
                      <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                        <Globe className="h-4 w-4 text-blue-500" />
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {company.website}
                        </a>
                      </div>
                    )}

                    {/* View Details Button */}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/companies/${company._id}`);
                      }}
                      className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 rounded-lg transition-all"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-96 bg-white rounded-xl border-2 border-dashed border-gray-300">
              <Briefcase className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-xl text-gray-600 font-medium">No companies found</p>
              <p className="text-gray-500 mt-2">Try adjusting your search filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentCompanyBrowse;
