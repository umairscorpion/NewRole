﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Subzz.Api.Controllers.Base;
using Subzz.Business.Services.Users.Interface;
using Subzz.Integration.Core.Domain;
using Subzz.Integration.Core.Helper;
using SubzzAbsence.Business.Absence.Interface;
using SubzzManage.Business.Manage.Interface;
using SubzzV2.Core.Models;

namespace Subzz.Api.Controllers.Manage
{
    [Produces("application/json")]
    [Route("api/Job")]
    public class JobController : BaseApiController
    {
        private readonly IJobService _jobService, IUserService;
        private readonly IAbsenceService _absenceService;
        private readonly IUserService _userService;
        public JobController(IJobService jobService, IAbsenceService absenceService, IUserService userService)
        {
            _jobService = jobService;
            _absenceService = absenceService;
            _userService = userService;
        }

        [Route("getAvailableJobs/{StartDate}/{EndDate}/{UserId}/{OrganizationId}/{DistrictId}/{Status}")]
        [HttpGet]
        public async Task<IEnumerable<AbsenceModel>>  GetAvailableJobs(DateTime StartDate, DateTime EndDate, string UserId, string OrganizationId, int DistrictId, int Status)
        {
            return await _jobService.GetAvailableJobs(StartDate, EndDate, UserId, OrganizationId, DistrictId, Status);
        }

        [Route("acceptJob/{AbsenceId}/{SubstituteId}/{AcceptVia}")]
        [HttpGet]
        public async Task<string> AcceptJob(int AbsenceId, string SubstituteId, string AcceptVia)
        {
            string AcceptJob = await _jobService.AcceptJob(AbsenceId, SubstituteId, AcceptVia);
            if(AcceptJob == "success")
            {
                //Send Notification here 
                //AbsenceModel absenceDetail = _absenceService.GetAbsenceDetailByAbsenceId(AbsenceId);
                //IEnumerable<SubzzV2.Core.Entities.User> users = _userService.GetAdminListByAbsenceId(AbsenceId);
                //Message message = new Message();
                //message.AbsenceId = absenceDetail.AbsenceId;
                //message.StartTime = Convert.ToDateTime(absenceDetail.StartTime).ToSubzzTime();
                //message.EndTime = Convert.ToDateTime(absenceDetail.EndTime).ToSubzzTime();
                //message.StartDate = Convert.ToDateTime(absenceDetail.StartDate).ToString("D");
                //message.EndDate = Convert.ToDateTime(absenceDetail.EndDate).ToString("D");
                //message.EmployeeName = absenceDetail.EmployeeName;
                //message.Position = absenceDetail.PositionDescription;
                //message.Subject = absenceDetail.SubjectDescription;
                //message.Grade = absenceDetail.Grade;
                //message.Location = absenceDetail.AbsenceLocation;
                //message.Notes = absenceDetail.SubstituteNotes;
                //message.Duration = absenceDetail.DurationType == 1 ? "Full Day" : absenceDetail.DurationType == 2 ? "First Half" : absenceDetail.DurationType == 3 ? "Second Half" : "Custom";
            }
            return AcceptJob;
        }

    }
}