/**
 * The $P Point-Cloud Recognizer (JavaScript version)
 *
 * 	Radu-Daniel Vatavu, Ph.D.
 *	University Stefan cel Mare of Suceava
 *	Suceava 720229, Romania
 *	vatavu@eed.usv.ro
 *
 *	Lisa Anthony, Ph.D.
 *      UMBC
 *      Information Systems Department
 *      1000 Hilltop Circle
 *      Baltimore, MD 21250
 *      lanthony@umbc.edu
 *
 *	Jacob O. Wobbrock, Ph.D.
 * 	The Information School
 *	University of Washington
 *	Seattle, WA 98195-2840
 *	wobbrock@uw.edu
 *
 * The academic publication for the $P recognizer, and what should be 
 * used to cite it, is:
 *
 *	Vatavu, R.-D., Anthony, L. and Wobbrock, J.O. (2012).  
 *	  Gestures as point clouds: A $P recognizer for user interface 
 *	  prototypes. Proceedings of the ACM Int'l Conference on  
 *	  Multimodal Interfaces (ICMI '12). Santa Monica, California  
 *	  (October 22-26, 2012). New York: ACM Press, pp. 273-280.
 *
 * This software is distributed under the "New BSD License" agreement:
 *
 * Copyright (c) 2012, Radu-Daniel Vatavu, Lisa Anthony, and 
 * Jacob O. Wobbrock. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *    * Redistributions of source code must retain the above copyright
 *      notice, this list of conditions and the following disclaimer.
 *    * Redistributions in binary form must reproduce the above copyright
 *      notice, this list of conditions and the following disclaimer in the
 *      documentation and/or other materials provided with the distribution.
 *    * Neither the names of the University Stefan cel Mare of Suceava, 
 *	University of Washington, nor UMBC, nor the names of its contributors 
 *	may be used to endorse or promote products derived from this software 
 *	without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL Radu-Daniel Vatavu OR Lisa Anthony
 * OR Jacob O. Wobbrock BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, 
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT 
 * OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS 
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, 
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
**/
//
// Point class
//
function Point(x, y, id) // constructor
{
	this.X = x;
	this.Y = y;
	this.ID = id; // stroke ID to which this point belongs (1,2,...)
}
//
// PointCloud class: a point-cloud template
//
function PointCloud(name, points) // constructor
{
	this.Name = name;
	this.Points = Resample(points, NumPoints);
	this.Points = Scale(this.Points);
	this.Points = TranslateTo(this.Points, Origin);
}
//
// Result class
//
function Result(name, score) // constructor
{
	this.Name = name;
	this.Score = score;
}
//
// PDollarRecognizer class constants
//
var NumPointClouds = 16;
var NumPoints = 32;
var Origin = new Point(0,0,0);
//
// PDollarRecognizer class
//
function PDollarRecognizer() // constructor
{
	//
	// one predefined point-cloud for each gesture
	//
	this.PointClouds = new Array();
	this.PointClouds[this.PointClouds.length] = new PointCloud("play", new Array(new Point(186,143,1),new Point(186,144,1),new Point(186,149,1),new Point(186,159,1),new Point(186,170,1),new Point(185,184,1),new Point(185,192,1),new Point(185,200,1),new Point(185,204,1),new Point(185,206,1),new Point(185,207,1),new Point(186,141,2),new Point(187,141,2),new Point(190,142,2),new Point(193,144,2),new Point(195,145,2),new Point(199,147,2),new Point(203,150,2),new Point(206,152,2),new Point(211,155,2),new Point(214,156,2),new Point(216,158,2),new Point(218,159,2),new Point(220,159,2),new Point(221,160,2),new Point(222,161,2),new Point(224,162,2),new Point(224,163,2),new Point(227,164,2),new Point(228,165,2),new Point(230,166,2),new Point(232,168,2),new Point(234,170,2),new Point(235,171,2),new Point(236,171,2),new Point(236,172,2),new Point(237,172,2),new Point(238,172,2),new Point(237,173,2),new Point(236,173,2),new Point(235,174,2),new Point(232,175,2),new Point(230,176,2),new Point(226,178,2),new Point(222,179,2),new Point(219,180,2),new Point(217,182,2),new Point(215,183,2),new Point(213,184,2),new Point(212,185,2),new Point(211,186,2),new Point(209,188,2),new Point(208,188,2),new Point(207,189,2),new Point(206,189,2),new Point(205,190,2),new Point(204,190,2),new Point(204,191,2),new Point(203,192,2),new Point(202,193,2),new Point(201,194,2),new Point(200,195,2),new Point(199,196,2),new Point(199,197,2),new Point(198,197,2),new Point(197,198,2),new Point(197,199,2),new Point(196,200,2),new Point(196,201,2),new Point(195,201,2),new Point(195,202,2),new Point(194,203,2),new Point(193,203,2),new Point(193,204,2),new Point(192,204,2),new Point(192,205,2),new Point(191,205,2),new Point(191,206,2),new Point(191,206,2),new Point(191,207,2),new Point(190,207,2),new Point(190,208,2),new Point(189,208,2),new Point(188,208,2),new Point(188,209,2),new Point(187,209,2),new Point(186,209,2)))
	// this.PointClouds[this.PointClouds.length] = new PointCloud("pause", new Array(new Point(180,189,1),new Point(180,191,1),new Point(180,194,1),new Point(180,200,1),new Point(180,207,1),new Point(180,212,1),new Point(180,219,1),new Point(180,224,1),new Point(180,227,1),new Point(180,229,1),new Point(180,230,1),new Point(181,230,1),new Point(183,230,1),new Point(184,230,1),new Point(185,230,1),new Point(187,230,1),new Point(188,230,1),new Point(189,230,1),new Point(190,230,1),new Point(192,230,1),new Point(193,230,1),new Point(194,230,1),new Point(196,230,1),new Point(199,230,1),new Point(201,230,1),new Point(202,230,1),new Point(203,230,1),new Point(205,230,1),new Point(207,230,1),new Point(208,230,1),new Point(209,230,1),new Point(210,230,1),new Point(212,230,1),new Point(213,230,1),new Point(214,230,1),new Point(214,230,1),new Point(216,230,1),new Point(217,230,1),new Point(218,230,1),new Point(218,230,1),new Point(219,230,1),new Point(219,229,1),new Point(219,228,1),new Point(219,226,1),new Point(219,222,1),new Point(218,216,1),new Point(217,212,1),new Point(217,209,1),new Point(216,206,1),new Point(216,204,1),new Point(216,201,1),new Point(215,200,1),new Point(215,198,1),new Point(215,197,1),new Point(215,195,1),new Point(215,195,1),new Point(215,194,1),new Point(215,193,1),new Point(215,192,1),new Point(215,191,1),new Point(215,190,1),new Point(214,190,1),new Point(213,190,1),new Point(212,190,1),new Point(211,190,1),new Point(209,190,1),new Point(208,190,1),new Point(206,190,1),new Point(204,190,1),new Point(202,190,1),new Point(200,190,1),new Point(198,190,1),new Point(197,190,1),new Point(195,190,1),new Point(194,190,1),new Point(193,190,1),new Point(191,190,1),new Point(188,190,1),new Point(187,190,1),new Point(186,190,1),new Point(185,190,1),new Point(184,190,1),new Point(184,189,1),new Point(183,189,1)))
	this.PointClouds[this.PointClouds.length] = new PointCloud("pause", new Array(new Point(143,99,1),new Point(143,99,1),new Point(143,105,1),new Point(143,110,1),new Point(143,116,1),new Point(143,123,1),new Point(143,130,1),new Point(143,136,1),new Point(143,142,1),new Point(144,145,1),new Point(144,148,1),new Point(144,149,1),new Point(144,150,1),new Point(162,98,2),new Point(162,99,2),new Point(162,100,2),new Point(162,102,2),new Point(162,104,2),new Point(162,106,2),new Point(162,108,2),new Point(162,111,2),new Point(162,113,2),new Point(162,115,2),new Point(162,117,2),new Point(163,119,2),new Point(163,121,2),new Point(163,122,2),new Point(163,124,2),new Point(163,125,2),new Point(163,126,2),new Point(163,127,2),new Point(164,128,2),new Point(164,129,2),new Point(164,130,2),new Point(164,131,2),new Point(164,132,2),new Point(164,133,2),new Point(164,134,2),new Point(164,135,2),new Point(164,136,2),new Point(164,137,2),new Point(164,138,2),new Point(164,138,2),new Point(164,139,2),new Point(164,140,2),new Point(164,141,2),new Point(164,142,2),new Point(164,143,2),new Point(164,143,2),new Point(164,144,2),new Point(164,145,2),new Point(164,146,2),new Point(164,147,2),new Point(164,148,2),new Point(164,148,2)))
	this.PointClouds[this.PointClouds.length] = new PointCloud("seekPlusTime", new Array(new Point(212,126,1),new Point(213,126,1),new Point(214,126,1),new Point(214,126,1),new Point(215,126,1),new Point(216,126,1),new Point(217,126,1),new Point(218,126,1),new Point(219,126,1),new Point(220,126,1),new Point(221,127,1),new Point(223,127,1),new Point(224,127,1),new Point(226,128,1),new Point(227,128,1),new Point(229,129,1),new Point(231,129,1),new Point(233,130,1),new Point(234,130,1),new Point(236,130,1),new Point(238,131,1),new Point(239,132,1),new Point(241,132,1),new Point(243,134,1),new Point(244,135,1),new Point(246,135,1),new Point(248,135,1),new Point(249,136,1),new Point(251,137,1),new Point(252,138,1),new Point(254,138,1),new Point(255,140,1),new Point(256,141,1),new Point(257,142,1),new Point(259,143,1),new Point(260,144,1),new Point(262,145,1),new Point(262,146,1),new Point(262,147,1),new Point(263,148,1),new Point(264,149,1),new Point(265,150,1),new Point(265,151,1),new Point(266,151,1),new Point(267,153,1),new Point(268,155,1),new Point(268,157,1),new Point(269,158,1),new Point(269,160,1),new Point(270,161,1),new Point(271,162,1),new Point(271,163,1),new Point(272,165,1),new Point(272,167,1),new Point(272,168,1),new Point(273,170,1),new Point(273,171,1),new Point(273,172,1),new Point(273,173,1),new Point(273,174,1),new Point(273,175,1),new Point(273,177,1),new Point(273,178,1),new Point(273,179,1),new Point(273,181,1),new Point(273,182,1),new Point(273,183,1),new Point(273,184,1),new Point(272,186,1),new Point(271,187,1),new Point(270,188,1),new Point(270,189,1),new Point(269,190,1),new Point(268,190,1),new Point(267,192,1),new Point(266,193,1),new Point(265,194,1),new Point(264,195,1),new Point(263,196,1),new Point(262,197,1),new Point(262,198,1),new Point(259,199,1),new Point(258,200,1),new Point(258,201,1),new Point(257,202,1),new Point(255,203,1),new Point(255,204,1),new Point(253,205,1),new Point(251,206,1),new Point(250,206,1),new Point(249,207,1),new Point(247,208,1),new Point(246,208,1),new Point(245,209,1),new Point(244,210,1),new Point(243,210,1),new Point(242,210,1),new Point(240,211,1),new Point(238,211,1),new Point(237,212,1),new Point(236,212,1),new Point(234,213,1),new Point(233,213,1),new Point(232,213,1),new Point(231,214,1),new Point(231,214,1),new Point(230,214,1),new Point(229,214,1),new Point(228,215,1),new Point(227,215,1),new Point(226,215,1),new Point(226,215,1),new Point(225,215,1),new Point(224,215,1),new Point(224,216,1),new Point(223,216,1),new Point(222,216,1),new Point(221,216,1),new Point(220,216,1),new Point(219,216,1),new Point(218,217,1),new Point(217,217,1),new Point(217,217,1),new Point(216,217,1),new Point(215,217,1),new Point(215,218,1),new Point(214,218,1),new Point(213,218,1),new Point(212,218,1),new Point(211,218,1),new Point(210,218,1),new Point(209,218,1),new Point(208,219,1),new Point(208,219,1),new Point(207,219,1),new Point(206,219,1),new Point(224,192,2),new Point(224,193,2),new Point(224,195,2),new Point(223,197,2),new Point(222,199,2),new Point(220,201,2),new Point(219,203,2),new Point(217,204,2),new Point(217,205,2),new Point(217,207,2),new Point(216,208,2),new Point(215,208,2),new Point(214,209,2),new Point(214,210,2),new Point(213,211,2),new Point(213,212,2),new Point(212,212,2),new Point(212,213,2),new Point(211,213,2),new Point(211,214,2),new Point(210,214,2),new Point(210,215,2),new Point(209,215,2),new Point(209,216,2),new Point(208,217,2),new Point(208,218,2),new Point(207,218,2),new Point(208,218,2),new Point(211,219,2),new Point(214,222,2),new Point(217,224,2),new Point(221,226,2),new Point(223,228,2),new Point(226,229,2),new Point(228,231,2),new Point(229,231,2),new Point(230,232,2),new Point(231,232,2),new Point(232,233,2),new Point(233,233,2)))
	this.PointClouds[this.PointClouds.length] = new PointCloud("seekMinusTime", new Array(new Point(240,272,1),new Point(241,272,1),new Point(244,272,1),new Point(248,272,1),new Point(251,272,1),new Point(255,270,1),new Point(261,266,1),new Point(266,263,1),new Point(272,259,1),new Point(278,254,1),new Point(283,248,1),new Point(289,244,1),new Point(293,240,1),new Point(296,237,1),new Point(299,233,1),new Point(301,230,1),new Point(303,227,1),new Point(304,225,1),new Point(305,222,1),new Point(306,218,1),new Point(307,214,1),new Point(308,209,1),new Point(309,205,1),new Point(309,202,1),new Point(309,200,1),new Point(309,197,1),new Point(309,194,1),new Point(309,190,1),new Point(307,186,1),new Point(306,183,1),new Point(303,179,1),new Point(301,175,1),new Point(299,172,1),new Point(296,167,1),new Point(294,163,1),new Point(293,161,1),new Point(290,158,1),new Point(287,155,1),new Point(285,153,1),new Point(282,151,1),new Point(281,149,1),new Point(279,147,1),new Point(277,146,1),new Point(276,145,1),new Point(273,143,1),new Point(271,142,1),new Point(269,140,1),new Point(267,139,1),new Point(265,138,1),new Point(264,137,1),new Point(262,136,1),new Point(260,135,1),new Point(257,134,1),new Point(255,133,1),new Point(253,132,1),new Point(251,131,1),new Point(248,131,1),new Point(247,130,1),new Point(244,129,1),new Point(242,128,1),new Point(241,126,1),new Point(239,126,1),new Point(237,125,1),new Point(236,125,1),new Point(235,124,1),new Point(233,124,1),new Point(232,124,1),new Point(230,124,1),new Point(229,123,1),new Point(228,123,1),new Point(227,123,1),new Point(226,123,1),new Point(225,123,1),new Point(224,123,1),new Point(223,123,1),new Point(234,155,2),new Point(234,155,2),new Point(234,152,2),new Point(234,150,2),new Point(234,147,2),new Point(234,145,2),new Point(234,142,2),new Point(233,139,2),new Point(232,137,2),new Point(231,135,2),new Point(231,133,2),new Point(230,132,2),new Point(230,131,2),new Point(229,129,2),new Point(229,128,2),new Point(229,128,2),new Point(228,128,2),new Point(228,127,2),new Point(227,127,2),new Point(226,127,2),new Point(226,126,2),new Point(225,126,2),new Point(225,125,2),new Point(224,125,2),new Point(224,124,2),new Point(223,124,2),new Point(223,123,2),new Point(222,123,2),new Point(223,123,2),new Point(224,123,2),new Point(225,123,2),new Point(227,123,2),new Point(228,123,2),new Point(230,122,2),new Point(232,121,2),new Point(235,119,2),new Point(237,119,2),new Point(238,118,2),new Point(239,117,2),new Point(241,116,2),new Point(242,115,2),new Point(244,114,2),new Point(245,113,2),new Point(246,112,2),new Point(248,112,2),new Point(249,111,2),new Point(252,110,2),new Point(253,110,2),new Point(254,110,2),new Point(254,109,2),new Point(255,109,2),new Point(256,109,2),new Point(257,109,2),new Point(258,108,2),new Point(259,108,2),new Point(260,108,2),new Point(261,107,2),new Point(262,107,2),new Point(263,107,2),new Point(263,107,2)))
	this.PointClouds[this.PointClouds.length] = new PointCloud("increasePlaybackRate", new Array(new Point(140,174,1),new Point(141,174,1),new Point(145,174,1),new Point(152,179,1),new Point(162,185,1),new Point(171,190,1),new Point(178,194,1),new Point(186,198,1),new Point(191,201,1),new Point(194,203,1),new Point(195,203,1),new Point(196,204,1),new Point(195,204,1),new Point(194,204,1),new Point(193,204,1),new Point(189,204,1),new Point(186,206,1),new Point(181,208,1),new Point(176,211,1),new Point(171,213,1),new Point(167,216,1),new Point(164,218,1),new Point(162,219,1),new Point(160,220,1),new Point(160,221,1),new Point(159,221,1),new Point(158,221,1),new Point(157,221,1),new Point(156,222,1),new Point(155,222,1),new Point(155,223,1),new Point(154,223,1),new Point(154,224,1),new Point(153,224,1),new Point(152,225,1),new Point(151,225,1),new Point(151,226,1),new Point(150,226,1),new Point(150,227,1),new Point(149,227,1),new Point(148,227,1),new Point(148,228,1),new Point(147,228,1),new Point(146,229,1),new Point(145,229,1),new Point(145,229,1),new Point(144,229,1),new Point(143,229,1),new Point(143,231,1),new Point(178,171,2),new Point(179,171,2),new Point(180,171,2),new Point(180,171,2),new Point(181,171,2),new Point(183,173,2),new Point(183,173,2),new Point(184,174,2),new Point(187,175,2),new Point(189,175,2),new Point(190,176,2),new Point(192,176,2),new Point(193,177,2),new Point(195,178,2),new Point(196,178,2),new Point(198,179,2),new Point(199,181,2),new Point(201,181,2),new Point(202,181,2),new Point(203,182,2),new Point(205,183,2),new Point(207,183,2),new Point(208,184,2),new Point(210,185,2),new Point(212,186,2),new Point(213,186,2),new Point(214,187,2),new Point(215,188,2),new Point(216,188,2),new Point(218,189,2),new Point(220,190,2),new Point(221,191,2),new Point(222,191,2),new Point(223,192,2),new Point(224,192,2),new Point(224,193,2),new Point(225,194,2),new Point(226,194,2),new Point(227,194,2),new Point(229,195,2),new Point(230,195,2),new Point(231,195,2),new Point(232,196,2),new Point(233,196,2),new Point(234,198,2),new Point(235,198,2),new Point(236,199,2),new Point(238,199,2),new Point(239,199,2),new Point(239,199,2),new Point(240,200,2),new Point(241,200,2),new Point(241,201,2),new Point(242,201,2),new Point(241,201,2),new Point(241,201,2),new Point(241,202,2),new Point(239,202,2),new Point(238,203,2),new Point(236,204,2),new Point(235,204,2),new Point(235,205,2),new Point(233,205,2),new Point(232,206,2),new Point(230,207,2),new Point(227,208,2),new Point(226,209,2),new Point(224,210,2),new Point(222,211,2),new Point(220,212,2),new Point(218,213,2),new Point(216,214,2),new Point(215,215,2),new Point(213,216,2),new Point(211,216,2),new Point(209,217,2),new Point(207,218,2),new Point(206,218,2),new Point(205,219,2),new Point(203,220,2),new Point(202,221,2),new Point(201,222,2),new Point(199,222,2),new Point(198,223,2),new Point(197,224,2),new Point(196,224,2),new Point(195,225,2),new Point(194,225,2),new Point(193,226,2),new Point(192,226,2),new Point(191,226,2),new Point(190,227,2),new Point(189,227,2),new Point(188,228,2),new Point(187,228,2),new Point(186,228,2),new Point(185,228,2),new Point(185,229,2),new Point(184,229,2),new Point(183,229,2),new Point(183,230,2),new Point(182,230,2),new Point(182,231,2),new Point(182,231,2)))
	this.PointClouds[this.PointClouds.length] = new PointCloud("decreasePlaybackRate", new Array(new Point(208,166,1),new Point(207,166,1),new Point(202,168,1),new Point(196,171,1),new Point(189,175,1),new Point(184,178,1),new Point(177,182,1),new Point(171,186,1),new Point(166,189,1),new Point(162,192,1),new Point(158,195,1),new Point(154,198,1),new Point(152,201,1),new Point(149,203,1),new Point(147,204,1),new Point(146,205,1),new Point(145,206,1),new Point(144,206,1),new Point(145,206,1),new Point(146,206,1),new Point(147,206,1),new Point(149,206,1),new Point(153,207,1),new Point(157,208,1),new Point(162,210,1),new Point(166,211,1),new Point(170,213,1),new Point(174,215,1),new Point(177,216,1),new Point(180,217,1),new Point(182,218,1),new Point(183,218,1),new Point(185,219,1),new Point(186,220,1),new Point(188,221,1),new Point(189,221,1),new Point(189,222,1),new Point(190,222,1),new Point(191,223,1),new Point(192,223,1),new Point(194,223,1),new Point(195,223,1),new Point(196,223,1),new Point(196,223,1),new Point(199,225,1),new Point(201,226,1),new Point(205,227,1),new Point(206,227,1),new Point(207,228,1),new Point(252,165,2),new Point(251,165,2),new Point(250,165,2),new Point(249,166,2),new Point(248,167,2),new Point(247,168,2),new Point(246,168,2),new Point(244,169,2),new Point(242,169,2),new Point(241,170,2),new Point(239,171,2),new Point(238,172,2),new Point(236,173,2),new Point(235,174,2),new Point(233,176,2),new Point(232,177,2),new Point(230,178,2),new Point(229,179,2),new Point(226,180,2),new Point(224,181,2),new Point(223,182,2),new Point(222,183,2),new Point(221,184,2),new Point(220,184,2),new Point(219,185,2),new Point(218,186,2),new Point(216,187,2),new Point(215,188,2),new Point(213,189,2),new Point(213,189,2),new Point(212,190,2),new Point(210,190,2),new Point(208,191,2),new Point(207,192,2),new Point(206,192,2),new Point(205,194,2),new Point(204,194,2),new Point(203,195,2),new Point(202,196,2),new Point(201,196,2),new Point(200,197,2),new Point(199,197,2),new Point(198,198,2),new Point(197,199,2),new Point(196,199,2),new Point(195,200,2),new Point(194,200,2),new Point(193,200,2),new Point(192,200,2),new Point(192,201,2),new Point(193,201,2),new Point(194,201,2),new Point(195,201,2),new Point(195,201,2),new Point(196,202,2),new Point(197,202,2),new Point(199,203,2),new Point(201,203,2),new Point(203,204,2),new Point(204,204,2),new Point(204,204,2),new Point(205,204,2),new Point(206,204,2),new Point(207,206,2),new Point(208,206,2),new Point(209,206,2),new Point(211,206,2),new Point(212,207,2),new Point(213,207,2),new Point(215,208,2),new Point(216,209,2),new Point(218,210,2),new Point(221,210,2),new Point(222,211,2),new Point(223,211,2),new Point(224,212,2),new Point(225,212,2),new Point(225,213,2),new Point(226,213,2),new Point(228,213,2),new Point(229,214,2),new Point(230,214,2),new Point(231,215,2),new Point(233,215,2),new Point(234,216,2),new Point(235,216,2),new Point(236,217,2),new Point(237,217,2),new Point(237,217,2),new Point(238,217,2),new Point(238,218,2),new Point(239,218,2),new Point(240,218,2),new Point(241,219,2),new Point(242,219,2),new Point(243,219,2),new Point(244,220,2),new Point(245,220,2),new Point(246,220,2),new Point(247,220,2),new Point(247,221,2),new Point(248,221,2)))
	this.PointClouds[this.PointClouds.length] = new PointCloud("increaseVolume", new Array(new Point(109,207,1),new Point(110,207,1),new Point(111,207,1),new Point(113,207,1),new Point(114,207,1),new Point(116,207,1),new Point(118,207,1),new Point(119,207,1),new Point(121,207,1),new Point(123,207,1),new Point(124,206,1),new Point(126,206,1),new Point(128,205,1),new Point(129,205,1),new Point(131,203,1),new Point(134,203,1),new Point(135,202,1),new Point(138,201,1),new Point(140,199,1),new Point(142,198,1),new Point(143,197,1),new Point(145,196,1),new Point(146,195,1),new Point(148,194,1),new Point(150,191,1),new Point(151,190,1),new Point(154,189,1),new Point(155,188,1),new Point(156,187,1),new Point(157,186,1),new Point(157,185,1),new Point(158,184,1),new Point(158,183,1),new Point(159,182,1),new Point(160,181,1),new Point(160,179,1),new Point(161,178,1),new Point(162,177,1),new Point(163,175,1),new Point(163,173,1),new Point(164,172,1),new Point(164,171,1),new Point(165,169,1),new Point(165,168,1),new Point(165,167,1),new Point(166,166,1),new Point(166,165,1),new Point(166,164,1),new Point(166,163,1),new Point(166,164,1),new Point(166,165,1),new Point(166,166,1),new Point(166,166,1),new Point(166,167,1),new Point(166,168,1),new Point(166,172,1),new Point(166,175,1),new Point(167,178,1),new Point(167,181,1),new Point(167,183,1),new Point(167,185,1),new Point(167,187,1),new Point(167,190,1),new Point(167,192,1),new Point(167,195,1),new Point(167,198,1),new Point(167,200,1),new Point(167,202,1),new Point(167,204,1),new Point(167,206,1),new Point(167,209,1),new Point(167,211,1),new Point(167,213,1),new Point(167,216,1),new Point(167,218,1),new Point(167,220,1),new Point(167,222,1),new Point(167,225,1),new Point(167,228,1),new Point(167,230,1),new Point(167,233,1),new Point(167,234,1),new Point(167,237,1),new Point(167,239,1),new Point(167,241,1),new Point(167,243,1),new Point(167,245,1),new Point(167,247,1),new Point(167,249,1),new Point(167,251,1),new Point(167,252,1),new Point(167,253,1),new Point(167,254,1),new Point(167,255,1),new Point(167,256,1),new Point(167,255,1),new Point(167,253,1),new Point(166,252,1),new Point(165,250,1),new Point(165,248,1),new Point(164,246,1),new Point(164,244,1),new Point(163,242,1),new Point(161,240,1),new Point(161,238,1),new Point(160,237,1),new Point(160,236,1),new Point(159,234,1),new Point(159,234,1),new Point(158,232,1),new Point(157,231,1),new Point(156,230,1),new Point(155,229,1),new Point(154,228,1),new Point(153,228,1),new Point(151,227,1),new Point(149,227,1),new Point(148,226,1),new Point(147,225,1),new Point(146,225,1),new Point(146,224,1),new Point(145,224,1),new Point(144,224,1),new Point(143,223,1),new Point(142,223,1),new Point(141,223,1),new Point(140,223,1),new Point(139,223,1),new Point(137,222,1),new Point(136,222,1),new Point(135,222,1),new Point(134,222,1),new Point(133,222,1),new Point(132,222,1),new Point(130,222,1),new Point(128,221,1),new Point(127,221,1),new Point(126,221,1),new Point(124,221,1),new Point(123,221,1),new Point(121,221,1),new Point(120,221,1),new Point(118,221,1),new Point(117,221,1),new Point(116,221,1),new Point(116,221,1),new Point(115,221,1),new Point(114,221,1),new Point(113,221,1),new Point(112,221,1),new Point(111,221,1),new Point(110,221,1),new Point(109,221,1),new Point(108,221,1),new Point(108,220,1),new Point(108,219,1),new Point(108,219,1),new Point(108,218,1),new Point(108,217,1),new Point(108,215,1),new Point(108,215,1),new Point(108,214,1),new Point(108,213,1),new Point(108,212,1),new Point(108,212,1),new Point(108,211,1),new Point(108,210,1),new Point(108,209,1),new Point(187,214,2),new Point(188,214,2),new Point(189,214,2),new Point(192,214,2),new Point(195,214,2),new Point(197,214,2),new Point(199,214,2),new Point(201,214,2),new Point(202,214,2),new Point(203,214,2),new Point(204,214,2),new Point(205,214,2),new Point(206,214,2),new Point(198,189,3),new Point(198,190,3),new Point(198,193,3),new Point(198,194,3),new Point(198,197,3),new Point(198,199,3),new Point(198,201,3),new Point(198,203,3),new Point(198,205,3),new Point(198,206,3),new Point(198,208,3),new Point(198,209,3),new Point(198,210,3),new Point(198,212,3),new Point(198,213,3),new Point(198,214,3),new Point(198,215,3),new Point(198,216,3),new Point(198,217,3),new Point(198,218,3),new Point(198,218,3),new Point(198,219,3),new Point(198,220,3),new Point(198,221,3),new Point(198,222,3),new Point(198,223,3),new Point(198,223,3),new Point(198,224,3),new Point(198,225,3),new Point(198,226,3)))
	this.PointClouds[this.PointClouds.length] = new PointCloud("decreaseVolume", new Array(new Point(162,170,1),new Point(163,170,1),new Point(165,170,1),new Point(166,170,1),new Point(168,170,1),new Point(169,169,1),new Point(171,169,1),new Point(173,168,1),new Point(175,167,1),new Point(177,166,1),new Point(178,165,1),new Point(179,164,1),new Point(180,164,1),new Point(181,163,1),new Point(183,161,1),new Point(184,159,1),new Point(186,158,1),new Point(187,156,1),new Point(188,155,1),new Point(188,154,1),new Point(189,153,1),new Point(190,151,1),new Point(191,150,1),new Point(191,149,1),new Point(192,148,1),new Point(192,147,1),new Point(193,146,1),new Point(193,144,1),new Point(194,142,1),new Point(194,142,1),new Point(194,140,1),new Point(194,139,1),new Point(195,138,1),new Point(195,137,1),new Point(195,136,1),new Point(195,135,1),new Point(195,135,1),new Point(195,134,1),new Point(195,133,1),new Point(195,132,1),new Point(197,132,1),new Point(197,131,1),new Point(197,132,1),new Point(197,133,1),new Point(197,134,1),new Point(197,136,1),new Point(197,138,1),new Point(197,140,1),new Point(198,142,1),new Point(198,145,1),new Point(198,148,1),new Point(198,151,1),new Point(198,154,1),new Point(198,157,1),new Point(198,162,1),new Point(198,165,1),new Point(198,169,1),new Point(198,173,1),new Point(198,176,1),new Point(198,178,1),new Point(198,180,1),new Point(198,182,1),new Point(198,186,1),new Point(198,189,1),new Point(198,192,1),new Point(198,195,1),new Point(198,199,1),new Point(198,203,1),new Point(198,205,1),new Point(198,208,1),new Point(198,211,1),new Point(198,213,1),new Point(198,215,1),new Point(198,216,1),new Point(198,217,1),new Point(198,218,1),new Point(198,219,1),new Point(198,220,1),new Point(198,221,1),new Point(198,222,1),new Point(198,221,1),new Point(198,220,1),new Point(198,219,1),new Point(197,219,1),new Point(197,218,1),new Point(195,217,1),new Point(195,215,1),new Point(195,214,1),new Point(194,213,1),new Point(193,212,1),new Point(193,211,1),new Point(192,210,1),new Point(191,209,1),new Point(191,207,1),new Point(190,207,1),new Point(189,206,1),new Point(189,205,1),new Point(187,204,1),new Point(187,203,1),new Point(187,202,1),new Point(186,201,1),new Point(185,200,1),new Point(184,199,1),new Point(183,199,1),new Point(182,199,1),new Point(182,198,1),new Point(181,196,1),new Point(180,196,1),new Point(180,196,1),new Point(179,196,1),new Point(178,195,1),new Point(176,195,1),new Point(176,195,1),new Point(175,195,1),new Point(174,195,1),new Point(173,194,1),new Point(172,194,1),new Point(171,194,1),new Point(170,194,1),new Point(169,194,1),new Point(168,194,1),new Point(167,194,1),new Point(166,194,1),new Point(165,194,1),new Point(164,194,1),new Point(164,193,1),new Point(163,193,1),new Point(162,193,1),new Point(161,193,1),new Point(160,193,1),new Point(159,193,1),new Point(158,193,1),new Point(158,193,1),new Point(158,192,1),new Point(158,191,1),new Point(158,190,1),new Point(158,189,1),new Point(158,188,1),new Point(158,187,1),new Point(158,186,1),new Point(158,185,1),new Point(159,184,1),new Point(159,184,1),new Point(159,183,1),new Point(159,182,1),new Point(159,182,1),new Point(159,181,1),new Point(159,179,1),new Point(159,178,1),new Point(159,177,1),new Point(159,177,1),new Point(159,176,1),new Point(159,175,1),new Point(159,174,1),new Point(159,173,1),new Point(159,173,1),new Point(159,172,1),new Point(159,171,1),new Point(159,170,1),new Point(159,169,1),new Point(212,180,2),new Point(213,180,2),new Point(216,180,2),new Point(218,180,2),new Point(220,180,2),new Point(221,180,2),new Point(222,180,2),new Point(223,180,2),new Point(224,180,2),new Point(226,180,2),new Point(227,180,2),new Point(228,180,2),new Point(229,180,2),new Point(230,180,2)))
	this.PointClouds[this.PointClouds.length] = new PointCloud("muted", new Array(new Point(125,178,1),new Point(126,178,1),new Point(127,178,1),new Point(128,178,1),new Point(129,178,1),new Point(130,178,1),new Point(131,178,1),new Point(132,178,1),new Point(133,178,1),new Point(134,178,1),new Point(135,178,1),new Point(138,178,1),new Point(139,178,1),new Point(139,178,1),new Point(140,178,1),new Point(141,178,1),new Point(143,178,1),new Point(144,178,1),new Point(144,177,1),new Point(146,177,1),new Point(146,176,1),new Point(147,176,1),new Point(148,175,1),new Point(149,175,1),new Point(149,174,1),new Point(150,173,1),new Point(151,172,1),new Point(152,171,1),new Point(153,170,1),new Point(154,169,1),new Point(154,168,1),new Point(155,167,1),new Point(156,167,1),new Point(157,166,1),new Point(157,165,1),new Point(158,164,1),new Point(159,163,1),new Point(160,162,1),new Point(160,161,1),new Point(161,160,1),new Point(161,159,1),new Point(162,158,1),new Point(163,158,1),new Point(163,156,1),new Point(164,155,1),new Point(165,154,1),new Point(165,153,1),new Point(166,152,1),new Point(166,151,1),new Point(167,150,1),new Point(167,150,1),new Point(168,150,1),new Point(168,149,1),new Point(168,148,1),new Point(169,148,1),new Point(169,146,1),new Point(169,146,1),new Point(170,146,1),new Point(170,145,1),new Point(170,145,1),new Point(170,144,1),new Point(170,143,1),new Point(171,143,1),new Point(171,142,1),new Point(171,141,1),new Point(172,141,1),new Point(172,140,1),new Point(172,139,1),new Point(172,139,1),new Point(172,140,1),new Point(172,141,1),new Point(172,143,1),new Point(172,145,1),new Point(172,148,1),new Point(172,152,1),new Point(174,156,1),new Point(174,160,1),new Point(174,164,1),new Point(175,167,1),new Point(175,171,1),new Point(175,175,1),new Point(175,179,1),new Point(175,184,1),new Point(175,188,1),new Point(175,191,1),new Point(175,194,1),new Point(175,197,1),new Point(175,199,1),new Point(175,202,1),new Point(175,203,1),new Point(175,206,1),new Point(175,208,1),new Point(175,210,1),new Point(175,212,1),new Point(175,215,1),new Point(175,217,1),new Point(175,220,1),new Point(175,222,1),new Point(174,224,1),new Point(174,227,1),new Point(174,228,1),new Point(172,230,1),new Point(172,232,1),new Point(172,233,1),new Point(172,233,1),new Point(171,233,1),new Point(171,231,1),new Point(169,229,1),new Point(168,226,1),new Point(167,223,1),new Point(165,221,1),new Point(164,218,1),new Point(163,216,1),new Point(162,212,1),new Point(161,210,1),new Point(160,207,1),new Point(159,205,1),new Point(158,204,1),new Point(157,203,1),new Point(157,202,1),new Point(155,202,1),new Point(154,201,1),new Point(153,200,1),new Point(152,199,1),new Point(151,199,1),new Point(151,199,1),new Point(150,199,1),new Point(150,198,1),new Point(149,198,1),new Point(148,198,1),new Point(147,197,1),new Point(146,197,1),new Point(145,197,1),new Point(144,197,1),new Point(143,197,1),new Point(142,197,1),new Point(141,197,1),new Point(140,197,1),new Point(139,197,1),new Point(138,197,1),new Point(136,197,1),new Point(135,197,1),new Point(133,197,1),new Point(132,197,1),new Point(132,195,1),new Point(131,195,1),new Point(130,195,1),new Point(129,195,1),new Point(128,195,1),new Point(128,195,1),new Point(128,194,1),new Point(128,193,1),new Point(128,192,1),new Point(128,191,1),new Point(128,190,1),new Point(128,190,1),new Point(128,189,1),new Point(128,188,1),new Point(128,187,1),new Point(128,186,1),new Point(128,185,1),new Point(128,184,1),new Point(128,183,1),new Point(128,182,1),new Point(128,181,1),new Point(127,181,1),new Point(127,180,1),new Point(127,180,1),new Point(127,179,1),new Point(127,178,1),new Point(126,178,1),new Point(126,177,1),new Point(126,176,1),new Point(129,139,2),new Point(130,139,2),new Point(131,140,2),new Point(132,141,2),new Point(133,143,2),new Point(134,144,2),new Point(135,145,2),new Point(136,146,2),new Point(138,148,2),new Point(139,150,2),new Point(140,151,2),new Point(141,151,2),new Point(142,152,2),new Point(142,153,2),new Point(143,154,2),new Point(143,155,2),new Point(145,156,2),new Point(146,157,2),new Point(146,158,2),new Point(147,159,2),new Point(148,159,2),new Point(149,161,2),new Point(150,162,2),new Point(150,163,2),new Point(151,164,2),new Point(153,165,2),new Point(153,166,2),new Point(154,167,2),new Point(155,167,2),new Point(156,170,2),new Point(157,171,2),new Point(158,172,2),new Point(159,174,2),new Point(160,175,2),new Point(162,177,2),new Point(164,178,2),new Point(165,179,2),new Point(166,181,2),new Point(167,182,2),new Point(168,183,2),new Point(170,186,2),new Point(171,187,2),new Point(173,188,2),new Point(174,189,2),new Point(174,190,2),new Point(175,190,2),new Point(176,191,2),new Point(177,192,2),new Point(178,193,2),new Point(179,194,2),new Point(180,195,2),new Point(181,196,2),new Point(182,197,2),new Point(184,198,2),new Point(185,200,2),new Point(186,201,2),new Point(188,202,2),new Point(189,204,2),new Point(190,205,2),new Point(191,206,2),new Point(192,207,2),new Point(193,208,2),new Point(194,208,2),new Point(195,209,2),new Point(195,211,2),new Point(196,212,2),new Point(197,212,2),new Point(197,213,2),new Point(198,214,2),new Point(199,214,2),new Point(199,215,2),new Point(200,215,2),new Point(200,216,2),new Point(201,217,2),new Point(202,218,2),new Point(202,219,2),new Point(203,220,2),new Point(205,221,2),new Point(206,223,2),new Point(207,224,2),new Point(208,225,2),new Point(209,226,2),new Point(210,227,2)))
	this.PointClouds[this.PointClouds.length] = new PointCloud("increaseWidth", new Array(new Point(185,143,1),new Point(185,144,1),new Point(185,150,1),new Point(185,158,1),new Point(185,170,1),new Point(185,182,1),new Point(185,194,1),new Point(184,201,1),new Point(184,211,1),new Point(184,216,1),new Point(183,218,1),new Point(183,219,1),new Point(183,220,1),new Point(206,141,2),new Point(206,142,2),new Point(206,147,2),new Point(206,151,2),new Point(206,158,2),new Point(206,165,2),new Point(206,171,2),new Point(206,177,2),new Point(206,182,2),new Point(206,186,2),new Point(206,191,2),new Point(206,196,2),new Point(206,201,2),new Point(206,205,2),new Point(206,208,2),new Point(206,211,2),new Point(206,214,2),new Point(206,215,2),new Point(206,216,2),new Point(206,217,2),new Point(206,218,2),new Point(183,178,3),new Point(181,178,3),new Point(176,178,3),new Point(173,178,3),new Point(169,178,3),new Point(166,178,3),new Point(163,178,3),new Point(159,178,3),new Point(156,178,3),new Point(154,178,3),new Point(152,178,3),new Point(150,178,3),new Point(149,178,3),new Point(148,178,3),new Point(147,178,3),new Point(146,178,3),new Point(145,178,3),new Point(144,178,3),new Point(161,152,4),new Point(161,153,4),new Point(161,155,4),new Point(160,157,4),new Point(159,160,4),new Point(158,162,4),new Point(157,164,4),new Point(155,167,4),new Point(154,170,4),new Point(152,172,4),new Point(150,174,4),new Point(149,176,4),new Point(148,178,4),new Point(147,180,4),new Point(146,181,4),new Point(146,181,4),new Point(145,181,4),new Point(145,182,4),new Point(147,183,4),new Point(148,184,4),new Point(149,187,4),new Point(150,189,4),new Point(151,190,4),new Point(152,192,4),new Point(152,193,4),new Point(153,194,4),new Point(153,195,4),new Point(155,196,4),new Point(155,197,4),new Point(156,197,4),new Point(207,176,5),new Point(208,176,5),new Point(211,176,5),new Point(216,176,5),new Point(221,176,5),new Point(225,176,5),new Point(232,176,5),new Point(235,176,5),new Point(238,176,5),new Point(240,176,5),new Point(241,176,5),new Point(242,176,5),new Point(244,176,5),new Point(245,176,5),new Point(235,155,6),new Point(235,156,6),new Point(235,157,6),new Point(235,160,6),new Point(237,161,6),new Point(238,163,6),new Point(238,165,6),new Point(240,166,6),new Point(240,167,6),new Point(241,169,6),new Point(241,169,6),new Point(242,170,6),new Point(242,171,6),new Point(242,172,6),new Point(243,172,6),new Point(243,173,6),new Point(243,174,6),new Point(243,175,6),new Point(243,176,6),new Point(243,177,6),new Point(243,178,6),new Point(241,179,6),new Point(240,181,6),new Point(237,183,6),new Point(236,185,6),new Point(235,186,6),new Point(235,187,6),new Point(234,188,6),new Point(234,189,6),new Point(233,189,6),new Point(232,190,6),new Point(231,191,6),new Point(231,192,6),new Point(230,192,6),new Point(230,193,6)))
	this.PointClouds[this.PointClouds.length] = new PointCloud("decreaseWidth", new Array(new Point(188,135,1),new Point(188,136,1),new Point(188,143,1),new Point(188,156,1),new Point(188,172,1),new Point(188,190,1),new Point(188,203,1),new Point(186,214,1),new Point(186,221,1),new Point(186,222,1),new Point(186,223,1),new Point(215,135,2),new Point(215,136,2),new Point(215,141,2),new Point(215,148,2),new Point(215,157,2),new Point(215,166,2),new Point(215,171,2),new Point(215,179,2),new Point(215,184,2),new Point(215,189,2),new Point(215,194,2),new Point(215,196,2),new Point(215,199,2),new Point(215,202,2),new Point(215,204,2),new Point(215,206,2),new Point(215,207,2),new Point(215,208,2),new Point(215,209,2),new Point(215,210,2),new Point(215,211,2),new Point(215,212,2),new Point(215,214,2),new Point(215,215,2),new Point(215,216,2),new Point(215,217,2),new Point(215,218,2),new Point(215,219,2),new Point(149,177,3),new Point(150,177,3),new Point(152,177,3),new Point(155,177,3),new Point(158,177,3),new Point(159,177,3),new Point(161,177,3),new Point(162,177,3),new Point(163,177,3),new Point(164,177,3),new Point(166,177,3),new Point(167,177,3),new Point(170,177,3),new Point(172,177,3),new Point(173,177,3),new Point(173,177,3),new Point(174,177,3),new Point(175,177,3),new Point(176,177,3),new Point(177,177,3),new Point(178,177,3),new Point(179,177,3),new Point(180,177,3),new Point(181,177,3),new Point(181,177,3),new Point(182,177,3),new Point(183,177,3),new Point(171,160,4),new Point(172,161,4),new Point(173,162,4),new Point(174,163,4),new Point(175,164,4),new Point(176,165,4),new Point(176,166,4),new Point(177,167,4),new Point(178,168,4),new Point(179,168,4),new Point(179,169,4),new Point(180,169,4),new Point(180,170,4),new Point(181,170,4),new Point(182,171,4),new Point(182,172,4),new Point(182,173,4),new Point(182,174,4),new Point(183,174,4),new Point(183,175,4),new Point(184,176,4),new Point(184,177,4),new Point(184,178,4),new Point(185,178,4),new Point(185,179,4),new Point(184,179,4),new Point(183,179,4),new Point(182,179,4),new Point(181,180,4),new Point(180,181,4),new Point(179,182,4),new Point(177,183,4),new Point(176,184,4),new Point(175,185,4),new Point(174,186,4),new Point(173,187,4),new Point(172,188,4),new Point(169,189,4),new Point(168,191,4),new Point(167,192,4),new Point(166,193,4),new Point(218,181,5),new Point(219,181,5),new Point(221,181,5),new Point(226,181,5),new Point(231,181,5),new Point(236,181,5),new Point(241,181,5),new Point(245,181,5),new Point(250,181,5),new Point(253,181,5),new Point(255,181,5),new Point(258,181,5),new Point(260,181,5),new Point(261,181,5),new Point(262,181,5),new Point(235,163,6),new Point(234,163,6),new Point(233,163,6),new Point(232,164,6),new Point(231,166,6),new Point(230,167,6),new Point(229,168,6),new Point(228,169,6),new Point(227,170,6),new Point(227,171,6),new Point(226,172,6),new Point(225,173,6),new Point(224,174,6),new Point(224,176,6),new Point(223,177,6),new Point(223,178,6),new Point(223,178,6),new Point(222,178,6),new Point(222,179,6),new Point(222,180,6),new Point(221,180,6),new Point(220,180,6),new Point(220,181,6),new Point(220,182,6),new Point(219,182,6),new Point(219,183,6),new Point(219,184,6),new Point(220,184,6),new Point(221,187,6),new Point(222,188,6),new Point(223,189,6),new Point(225,191,6),new Point(227,193,6),new Point(229,195,6),new Point(230,196,6),new Point(231,197,6),new Point(232,198,6),new Point(232,199,6),new Point(232,200,6),new Point(233,200,6),new Point(233,200,6),new Point(234,200,6),new Point(234,201,6)))	
	this.PointClouds[this.PointClouds.length] = new PointCloud("increaseHeight", new Array(new Point(179,176,1),new Point(180,176,1),new Point(185,176,1),new Point(192,176,1),new Point(200,176,1),new Point(206,176,1),new Point(214,176,1),new Point(220,176,1),new Point(225,176,1),new Point(228,176,1),new Point(230,176,1),new Point(232,176,1),new Point(233,176,1),new Point(234,176,1),new Point(180,202,2),new Point(181,202,2),new Point(186,202,2),new Point(194,202,2),new Point(202,202,2),new Point(208,202,2),new Point(217,202,2),new Point(223,202,2),new Point(226,202,2),new Point(228,202,2),new Point(230,202,2),new Point(231,202,2),new Point(232,202,2),new Point(233,202,2),new Point(207,171,3),new Point(207,169,3),new Point(207,167,3),new Point(207,162,3),new Point(207,157,3),new Point(207,151,3),new Point(207,145,3),new Point(207,141,3),new Point(207,137,3),new Point(207,134,3),new Point(207,131,3),new Point(207,129,3),new Point(207,125,3),new Point(207,124,3),new Point(207,124,3),new Point(207,123,3),new Point(207,123,4),new Point(206,123,4),new Point(205,123,4),new Point(203,125,4),new Point(199,127,4),new Point(195,129,4),new Point(192,132,4),new Point(189,134,4),new Point(186,136,4),new Point(183,138,4),new Point(181,140,4),new Point(179,141,4),new Point(178,142,4),new Point(209,123,5),new Point(210,123,5),new Point(212,123,5),new Point(214,123,5),new Point(218,124,5),new Point(220,126,5),new Point(222,127,5),new Point(225,129,5),new Point(227,131,5),new Point(228,133,5),new Point(230,134,5),new Point(231,135,5),new Point(232,135,5),new Point(232,136,5),new Point(233,137,5),new Point(234,137,5),new Point(234,138,5),new Point(235,138,5),new Point(236,139,5),new Point(206,205,6),new Point(206,207,6),new Point(206,211,6),new Point(206,215,6),new Point(206,219,6),new Point(206,224,6),new Point(204,228,6),new Point(204,232,6),new Point(204,237,6),new Point(204,241,6),new Point(204,244,6),new Point(204,247,6),new Point(204,250,6),new Point(204,253,6),new Point(204,256,6),new Point(204,259,6),new Point(204,262,6),new Point(204,264,6),new Point(204,266,6),new Point(204,267,6),new Point(204,268,6),new Point(204,266,7),new Point(203,266,7),new Point(201,265,7),new Point(198,264,7),new Point(195,262,7),new Point(193,261,7),new Point(192,260,7),new Point(191,260,7),new Point(190,259,7),new Point(189,257,7),new Point(188,257,7),new Point(187,256,7),new Point(186,255,7),new Point(185,255,7),new Point(207,268,8),new Point(207,267,8),new Point(208,267,8),new Point(208,266,8),new Point(209,265,8),new Point(210,264,8),new Point(211,263,8),new Point(212,262,8),new Point(213,261,8),new Point(214,260,8),new Point(215,259,8),new Point(216,258,8),new Point(217,257,8),new Point(218,256,8),new Point(219,256,8),new Point(219,255,8),new Point(220,255,8),new Point(220,254,8),new Point(221,254,8),new Point(222,254,8),new Point(223,253,8),new Point(224,253,8),new Point(224,252,8),new Point(224,252,8)))	
	this.PointClouds[this.PointClouds.length] = new PointCloud("decreaseHeight", new Array(new Point(166,160,1),new Point(168,160,1),new Point(176,160,1),new Point(188,160,1),new Point(199,160,1),new Point(212,160,1),new Point(218,160,1),new Point(228,160,1),new Point(236,160,1),new Point(243,160,1),new Point(252,160,1),new Point(258,160,1),new Point(263,160,1),new Point(266,160,1),new Point(267,160,1),new Point(269,160,1),new Point(162,194,2),new Point(162,194,2),new Point(169,194,2),new Point(175,194,2),new Point(181,194,2),new Point(187,194,2),new Point(194,194,2),new Point(200,194,2),new Point(205,194,2),new Point(211,194,2),new Point(216,194,2),new Point(221,194,2),new Point(226,194,2),new Point(230,194,2),new Point(236,194,2),new Point(239,194,2),new Point(243,193,2),new Point(246,192,2),new Point(251,192,2),new Point(254,192,2),new Point(257,192,2),new Point(260,191,2),new Point(262,191,2),new Point(265,191,2),new Point(268,191,2),new Point(269,191,2),new Point(270,191,2),new Point(271,191,2),new Point(223,67,3),new Point(223,66,3),new Point(223,67,3),new Point(223,70,3),new Point(223,73,3),new Point(223,77,3),new Point(223,82,3),new Point(223,87,3),new Point(223,94,3),new Point(223,101,3),new Point(223,108,3),new Point(223,114,3),new Point(223,119,3),new Point(223,123,3),new Point(223,128,3),new Point(222,132,3),new Point(222,135,3),new Point(222,138,3),new Point(222,141,3),new Point(222,145,3),new Point(221,147,3),new Point(221,149,3),new Point(221,151,3),new Point(221,152,3),new Point(221,153,3),new Point(221,154,3),new Point(221,155,3),new Point(221,156,3),new Point(196,132,4),new Point(197,132,4),new Point(199,133,4),new Point(200,135,4),new Point(201,136,4),new Point(203,138,4),new Point(204,140,4),new Point(205,141,4),new Point(206,142,4),new Point(207,143,4),new Point(207,144,4),new Point(209,145,4),new Point(210,146,4),new Point(211,147,4),new Point(211,148,4),new Point(212,149,4),new Point(213,149,4),new Point(214,150,4),new Point(215,151,4),new Point(215,152,4),new Point(215,152,4),new Point(217,152,4),new Point(217,154,4),new Point(262,127,5),new Point(262,127,5),new Point(261,128,5),new Point(258,131,5),new Point(254,134,5),new Point(251,137,5),new Point(248,139,5),new Point(246,141,5),new Point(245,142,5),new Point(243,144,5),new Point(242,146,5),new Point(241,147,5),new Point(240,147,5),new Point(239,148,5),new Point(238,148,5),new Point(237,149,5),new Point(236,150,5),new Point(235,150,5),new Point(234,151,5),new Point(233,151,5),new Point(231,152,5),new Point(230,153,5),new Point(229,154,5),new Point(228,154,5),new Point(228,155,5),new Point(227,155,5),new Point(226,155,5),new Point(225,155,5),new Point(225,156,5),new Point(225,156,5),new Point(218,201,6),new Point(218,202,6),new Point(218,207,6),new Point(218,215,6),new Point(218,224,6),new Point(218,233,6),new Point(218,240,6),new Point(218,250,6),new Point(218,258,6),new Point(216,265,6),new Point(216,273,6),new Point(216,279,6),new Point(216,286,6),new Point(216,291,6),new Point(216,295,6),new Point(216,300,6),new Point(216,302,6),new Point(216,304,6),new Point(216,306,6),new Point(216,307,6),new Point(217,205,7),new Point(216,205,7),new Point(215,205,7),new Point(212,207,7),new Point(209,210,7),new Point(206,213,7),new Point(204,215,7),new Point(201,218,7),new Point(199,221,7),new Point(195,224,7),new Point(194,226,7),new Point(192,227,7),new Point(191,229,7),new Point(190,230,7),new Point(190,231,7),new Point(217,203,8),new Point(219,203,8),new Point(221,204,8),new Point(224,206,8),new Point(227,208,8),new Point(231,211,8),new Point(235,213,8),new Point(237,216,8),new Point(239,218,8),new Point(241,220,8),new Point(243,222,8),new Point(245,223,8),new Point(247,224,8),new Point(248,225,8),new Point(248,226,8),new Point(249,227,8),new Point(251,228,8),new Point(251,229,8),new Point(252,230,8),new Point(253,230,8)))	
	this.PointClouds[this.PointClouds.length] = new PointCloud("addVideo", new Array(new Point(162,122,1),new Point(164,122,1),new Point(167,122,1),new Point(173,122,1),new Point(178,122,1),new Point(183,122,1),new Point(186,122,1),new Point(189,122,1),new Point(190,122,1),new Point(190,122,1),new Point(174,107,2),new Point(174,108,2),new Point(174,110,2),new Point(174,112,2),new Point(174,114,2),new Point(174,115,2),new Point(174,117,2),new Point(174,119,2),new Point(174,120,2),new Point(174,121,2),new Point(174,122,2),new Point(175,125,2),new Point(175,127,2),new Point(175,129,2),new Point(175,130,2),new Point(175,131,2),new Point(175,132,2),new Point(175,133,2),new Point(175,134,2)))

	this.PointClouds[this.PointClouds.length] = new PointCloud("deleteVideo", new Array(new Point(117,94,1),new Point(118,94,1),new Point(120,96,1),new Point(122,98,1),new Point(125,100,1),new Point(127,101,1),new Point(130,104,1),new Point(131,106,1),new Point(133,107,1),new Point(134,108,1),new Point(135,109,1),new Point(136,110,1),new Point(137,110,1),new Point(137,111,1),new Point(138,111,1),new Point(138,112,1),new Point(139,112,1),new Point(139,113,1),new Point(138,92,2),new Point(137,92,2),new Point(137,93,2),new Point(136,93,2),new Point(136,94,2),new Point(135,95,2),new Point(134,95,2),new Point(134,96,2),new Point(133,97,2),new Point(133,97,2),new Point(132,97,2),new Point(132,98,2),new Point(131,98,2),new Point(131,99,2),new Point(130,99,2),new Point(130,100,2),new Point(129,101,2),new Point(129,101,2),new Point(129,102,2),new Point(127,103,2),new Point(126,104,2),new Point(126,105,2),new Point(125,105,2),new Point(125,106,2),new Point(125,106,2),new Point(124,106,2),new Point(124,107,2),new Point(123,107,2),new Point(123,108,2),new Point(122,108,2),new Point(122,109,2),new Point(121,109,2),new Point(121,110,2),new Point(120,110,2),new Point(120,111,2),new Point(119,111,2),new Point(119,112,2),new Point(119,113,2),new Point(118,113,2),new Point(117,113,2),new Point(117,114,2)))


	//
	// The $P Point-Cloud Recognizer API begins here -- 3 methods: Recognize(), AddGesture(), DeleteUserGestures()
	//
	this.Recognize = function(points)
	{
		points = Resample(points, NumPoints);
		points = Scale(points);
		points = TranslateTo(points, Origin);
		
		var b = +Infinity;
		var u = -1;
		for (var i = 0; i < this.PointClouds.length; i++) // for each point-cloud template
		{
			var d = GreedyCloudMatch(points, this.PointClouds[i]);
			if (d < b) {
				b = d; // best (least) distance
				u = i; // point-cloud
			}
		}
		return (u == -1) ? new Result("No match.", 0.0) : new Result(this.PointClouds[u].Name, Math.max((b - 2.0) / -2.0, 0.0));
	};
	this.AddGesture = function(name, points)
	{
		this.PointClouds[this.PointClouds.length] = new PointCloud(name, points);
		var num = 0;
		for (var i = 0; i < this.PointClouds.length; i++) {
			if (this.PointClouds[i].Name == name)
				num++;
		}
		return num;
	}
	this.DeleteUserGestures = function()
	{
		this.PointClouds.length = NumPointClouds; // clear any beyond the original set
		return NumPointClouds;
	}
}
//
// Private helper functions from this point down
//
function GreedyCloudMatch(points, P)
{
	var e = 0.50;
	var step = Math.floor(Math.pow(points.length, 1 - e));
	var min = +Infinity;
	for (var i = 0; i < points.length; i += step) {
		var d1 = CloudDistance(points, P.Points, i);
		var d2 = CloudDistance(P.Points, points, i);
		min = Math.min(min, Math.min(d1, d2)); // min3
	}
	return min;
}
function CloudDistance(pts1, pts2, start)
{
	var matched = new Array(pts1.length); // pts1.length == pts2.length
	for (var k = 0; k < pts1.length; k++)
		matched[k] = false;
	var sum = 0;
	var i = start;
	do
	{
		var index = -1;
		var min = +Infinity;
		for (var j = 0; j < matched.length; j++)
		{
			if (!matched[j]) {
				var d = Distance(pts1[i], pts2[j]);
				if (d < min) {
					min = d;
					index = j;
				}
			}
		}
		matched[index] = true;
		var weight = 1 - ((i - start + pts1.length) % pts1.length) / pts1.length;
		sum += weight * min;
		i = (i + 1) % pts1.length;
	} while (i != start);
	return sum;
}

function Resample(points, n)
{
	var I = PathLength(points) / (n - 1); // interval length
	var D = 0.0;
	var newpoints = new Array(points[0]);
	for (var i = 1; i < points.length; i++)
	{
		if (points[i].ID == points[i-1].ID)
		{
			var d = Distance(points[i - 1], points[i]);
			if ((D + d) >= I)
			{
				var qx = points[i - 1].X + ((I - D) / d) * (points[i].X - points[i - 1].X);
				var qy = points[i - 1].Y + ((I - D) / d) * (points[i].Y - points[i - 1].Y);
				var q = new Point(qx, qy, points[i].ID);
				newpoints[newpoints.length] = q; // append new point 'q'
				points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i
				D = 0.0;
			}
			else D += d;
		}
	}
	if (newpoints.length == n - 1) // sometimes we fall a rounding-error short of adding the last point, so add it if so
		newpoints[newpoints.length] = new Point(points[points.length - 1].X, points[points.length - 1].Y, points[points.length - 1].ID);
	return newpoints;
}
function Scale(points)
{
	var minX = +Infinity, maxX = -Infinity, minY = +Infinity, maxY = -Infinity;
	for (var i = 0; i < points.length; i++) {
		minX = Math.min(minX, points[i].X);
		minY = Math.min(minY, points[i].Y);
		maxX = Math.max(maxX, points[i].X);
		maxY = Math.max(maxY, points[i].Y);
	}
	var size = Math.max(maxX - minX, maxY - minY);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = (points[i].X - minX) / size;
		var qy = (points[i].Y - minY) / size;
		newpoints[newpoints.length] = new Point(qx, qy, points[i].ID);
	}
	return newpoints;
}
function TranslateTo(points, pt) // translates points' centroid
{
	var c = Centroid(points);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = points[i].X + pt.X - c.X;
		var qy = points[i].Y + pt.Y - c.Y;
		newpoints[newpoints.length] = new Point(qx, qy, points[i].ID);
	}
	return newpoints;
}
function Centroid(points)
{
	var x = 0.0, y = 0.0;
	for (var i = 0; i < points.length; i++) {
		x += points[i].X;
		y += points[i].Y;
	}
	x /= points.length;
	y /= points.length;
	return new Point(x, y, 0);
}
function PathDistance(pts1, pts2) // average distance between corresponding points in two paths
{
	var d = 0.0;
	for (var i = 0; i < pts1.length; i++) // assumes pts1.length == pts2.length
		d += Distance(pts1[i], pts2[i]);
	return d / pts1.length;
}
function PathLength(points) // length traversed by a point path
{
	var d = 0.0;
	for (var i = 1; i < points.length; i++)
	{
		if (points[i].ID == points[i-1].ID)
			d += Distance(points[i - 1], points[i]);
	}
	return d;
}
function Distance(p1, p2) // Euclidean distance between two points
{
	var dx = p2.X - p1.X;
	var dy = p2.Y - p1.Y;
	return Math.sqrt(dx * dx + dy * dy);
}