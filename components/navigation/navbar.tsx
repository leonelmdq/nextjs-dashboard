'use client'
import React from "react";
import Logo from "@/components/navigation/logo";
import LogoutButton from "@/app/_logout/page";
import Link from "next/link";
import {
    TruckIcon,
    //UserGroupIcon,
    BookOpenIcon,
    //UsersIcon,
    HomeIcon,
    ClockIcon,
    //CircleStackIcon,
    UserCircleIcon,
    GlobeAmericasIcon,
    UserMinusIcon,
    PhotoIcon,
    PresentationChartBarIcon,
    BuildingOffice2Icon,
} from '@heroicons/react/24/outline';

const Navbar = () => {
    const user = JSON.parse(sessionStorage.getItem('user')!);

    return (
        <div className="navbar bg-sky-800">
            <div className="invisible sm:visible place-content-center">
                <Logo />
            </div>
            <div className='sm:hidden place-content-center'>
                <Link href="/home">
                    <img src="/minilogo.png" alt="Logo" className='object-contain' />
                </Link>
            </div>
            <h1 className="ml-2 text-2xl text-white">Bienvenido {user.nombreCompleto}</h1>
            <div className="">
                <ul className="hidden lg:flex gap-x-3 text-white items-center">
                    {/*<li className="flex-1">
                        <Link href="/home" className="flex flex-col items-center justify-center text-center h-16 gap-y-1">
                            <HomeIcon className="w-6 md:w-8" />
                            <p className="text-sm md:text-base">Home</p>
                        </Link>
                    </li>*/}
                    <li className="flex-1">
                        <Link href="/legajos" className="flex flex-col items-center justify-center text-center h-16 gap-y-1">
                            <BookOpenIcon className="w-6 md:w-8" />
                            <p className="text-sm md:text-base">Legajos</p>
                        </Link>
                    </li>
                    <li className="flex-1">
                        <Link href="/fichadasControl" className="flex flex-col items-center justify-center text-center h-16 gap-y-1">
                            <ClockIcon className="w-6 md:w-8" />
                            <p className="text-sm md:text-base">Fichadas</p>
                        </Link>
                    </li>
                    <li className="flex-1">
                        <Link href="/representantes" className="flex flex-col items-center justify-center text-center h-16 gap-y-2">
                            <GlobeAmericasIcon className="w-6 md:w-8" />
                            <p className="text-sm md:text-base">Representantes</p>
                        </Link>
                    </li>
                    <li className="flex-1">
                        <Link href="/despachantes" className="flex flex-col items-center justify-center text-center h-16 gap-y-2">
                            <UserCircleIcon className="w-6 md:w-8" />
                            <p className="text-sm md:text-base">Despachantes</p>
                        </Link>
                    </li>
                    <li className="flex-1">
                        <Link href="/novedadAusentismo" className="flex flex-col items-center justify-center text-center h-16 gap-y-2">
                            <UserMinusIcon className="w-6 md:w-8" />
                            <p className="text-sm md:text-base">Ausentismos</p>
                        </Link>
                    </li>
                    <li className="flex-1">
                        <Link href="/transportes" className="flex flex-col items-center justify-center text-center h-16 gap-y-2">
                            <UserMinusIcon className="w-6 md:w-8" />
                            <p className="text-sm md:text-base">Transportes</p>
                        </Link>
                    </li>
                    <li className="flex-1">
                        <Link href="/novedadVacacion" className="flex flex-col items-center justify-center text-center h-16 gap-y-2">
                            <PhotoIcon className="w-6 md:w-8" />
                            <p className="text-sm md:text-base">Vacaciones</p>
                        </Link>
                    </li>
                    <li className="flex-1">
                        <Link href="/vehiculos" className="flex flex-col items-center justify-center text-center h-16 gap-y-2">
                            <TruckIcon className="w-6 md:w-8" />
                            <p className="text-sm md:text-base">Vehiculos</p>
                        </Link>
                    </li>
                    <li className="flex-1">
                        <Link href="/presentaciones" className="flex flex-col items-center justify-center text-center h-16 gap-y-2">
                            <PresentationChartBarIcon className="w-6 md:w-8" />
                            <p className="text-sm md:text-base">Presentaciones</p>
                        </Link>
                    </li>
                    {/*<li className="flex-1">
                        <Link href="/plantas" className="flex flex-col items-center justify-center text-center h-16 gap-y-2">
                            <BuildingOffice2Icon className="w-6 md:w-8" />
                            <p className="text-sm md:text-base">Plantas</p>
                        </Link>
                    </li>*/}
                    <li className="flex-1">
                        <Link href="/limpiezas" className="flex flex-col items-center justify-center text-center h-16 gap-y-2">
                            <BuildingOffice2Icon className="w-6 md:w-8" />
                            <p className="text-sm md:text-base">Limpiezas</p>
                        </Link>
                    </li>
                    {/*<li className="flex-1">
                        <Link href="/feriados" className="flex flex-col items-center justify-center text-center h-16 gap-y-2">
                            <BuildingOffice2Icon className="w-6 md:w-8" />
                            <p className="text-sm md:text-base">Feriados</p>
                        </Link>
                    </li>*/}
                    <li className="flex-1">
                        <Link href="/pallets" className="flex flex-col items-center justify-center text-center h-16 gap-y-2">
                            <BuildingOffice2Icon className="w-6 md:w-8" />
                            <p className="text-sm md:text-base">Pallets</p>
                        </Link>
                    </li>
                    <li className="flex-1">
                        <LogoutButton />
                    </li>
                </ul>
                <div className="flex-none lg:hidden">
                    <ul className="menu menu-vertical px-1">
                        <li>
                            <details>
                                <summary className="text-white">Menú</summary>
                                <ul className="bg-white rounded-t-none p-2">
                                    <li className="flex-1">
                                        <Link href="/home" className="flex flex-col items-center justify-center text-center h-16 gap-y-1">
                                            <HomeIcon className="w-6 md:w-8" />
                                            <p className="text-sm md:text-base">Home</p>
                                        </Link>
                                    </li>
                                    <li className="flex-1">
                                        <Link href="/legajos" className="flex flex-col items-center justify-center text-center h-16 gap-y-1">
                                            <BookOpenIcon className="w-6 md:w-8" />
                                            <p className="text-sm md:text-base">Legajos</p>
                                        </Link>
                                    </li>
                                    <li className="flex-1">
                                        <Link href="/fichadasControl" className="flex flex-col items-center justify-center text-center h-16 gap-y-1">
                                            <ClockIcon className="w-6 md:w-8" />
                                            <p className="text-sm md:text-base">Fichadas</p>
                                        </Link>
                                    </li>
                                    <li className="flex-1">
                                        <Link href="/representantes" className="flex flex-col items-center justify-center text-center h-16 gap-y-2">
                                            <GlobeAmericasIcon className="w-6 md:w-8" />
                                            <p className="text-sm md:text-base">Representantes</p>
                                        </Link>
                                    </li>
                                    <li className="flex-1">
                                        <Link href="/despachantes" className="flex flex-col items-center justify-center text-center h-16 gap-y-2">
                                            <UserCircleIcon className="w-6 md:w-8" />
                                            <p className="text-sm md:text-base">Despachantes</p>
                                        </Link>
                                    </li>
                                    <li className="flex-1">
                                        <Link href="/novedadAusentismo" className="flex flex-col items-center justify-center text-center h-16 gap-y-2">
                                            <UserMinusIcon className="w-6 md:w-8" />
                                            <p className="text-sm md:text-base">Ausentismos</p>
                                        </Link>
                                    </li>
                                    <li className="flex-1">
                                        <Link href="/transportes" className="flex flex-col items-center justify-center text-center h-16 gap-y-2">
                                            <UserMinusIcon className="w-6 md:w-8" />
                                            <p className="text-sm md:text-base">Transportes</p>
                                        </Link>
                                    </li>
                                    <li className="flex-1">
                                        <Link href="/novedadVacacion" className="flex flex-col items-center justify-center text-center h-16 gap-y-2">
                                            <PhotoIcon className="w-6 md:w-8" />
                                            <p className="text-sm md:text-base">Vacaciones</p>
                                        </Link>
                                    </li>
                                    <li className="flex-1">
                                        <Link href="/vehiculos" className="flex flex-col items-center justify-center text-center h-16 gap-y-2">
                                            <TruckIcon className="w-6 md:w-8" />
                                            <p className="text-sm md:text-base">Vehiculos</p>
                                        </Link>
                                    </li>
                                    <li className="flex-1">
                                        <Link href="/presentaciones" className="flex flex-col items-center justify-center text-center h-16 gap-y-2">
                                            <PresentationChartBarIcon className="w-6 md:w-8" />
                                            <p className="text-sm md:text-base">Presentaciones</p>
                                        </Link>
                                    </li>
                                    <li className="flex-1">
                                        <Link href="/limpiezas" className="flex flex-col items-center justify-center text-center h-16 gap-y-2">
                                            <BuildingOffice2Icon className="w-6 md:w-8" />
                                            <p className="text-sm md:text-base">Limpiezas</p>
                                        </Link>
                                    </li>
                                    <li className="flex-1">
                                        <Link href="/feriados" className="flex flex-col items-center justify-center text-center h-16 gap-y-2">
                                            <BuildingOffice2Icon className="w-6 md:w-8" />
                                            <p className="text-sm md:text-base">Feriados</p>
                                        </Link>
                                    </li>
                                    <li className="flex-1">
                                        <LogoutButton />
                                    </li>
                                </ul>
                            </details>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    );
};

export default Navbar;
