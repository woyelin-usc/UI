/**
 * The $1 Unistroke Recognizer (JavaScript version)
 *
 *	Jacob O. Wobbrock, Ph.D.
 * 	The Information School
 *	University of Washington
 *	Seattle, WA 98195-2840
 *	wobbrock@uw.edu
 *
 *	Andrew D. Wilson, Ph.D.
 *	Microsoft Research
 *	One Microsoft Way
 *	Redmond, WA 98052
 *	awilson@microsoft.com
 *
 *	Yang Li, Ph.D.
 *	Department of Computer Science and Engineering
 * 	University of Washington
 *	Seattle, WA 98195-2840
 * 	yangli@cs.washington.edu
 *
 * The academic publication for the $1 recognizer, and what should be 
 * used to cite it, is:
 *
 *	Wobbrock, J.O., Wilson, A.D. and Li, Y. (2007). Gestures without 
 *	  libraries, toolkits or training: A $1 recognizer for user interface 
 *	  prototypes. Proceedings of the ACM Symposium on User Interface 
 *	  Software and Technology (UIST '07). Newport, Rhode Island (October 
 *	  7-10, 2007). New York: ACM Press, pp. 159-168.
 *
 * The Protractor enhancement was separately published by Yang Li and programmed 
 * here by Jacob O. Wobbrock:
 *
 *	Li, Y. (2010). Protractor: A fast and accurate gesture
 *	  recognizer. Proceedings of the ACM Conference on Human
 *	  Factors in Computing Systems (CHI '10). Atlanta, Georgia
 *	  (April 10-15, 2010). New York: ACM Press, pp. 2169-2172.
 *
 * This software is distributed under the "New BSD License" agreement:
 *
 * Copyright (C) 2007-2012, Jacob O. Wobbrock, Andrew D. Wilson and Yang Li.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *    * Redistributions of source code must retain the above copyright
 *      notice, this list of conditions and the following disclaimer.
 *    * Redistributions in binary form must reproduce the above copyright
 *      notice, this list of conditions and the following disclaimer in the
 *      documentation and/or other materials provided with the distribution.
 *    * Neither the names of the University of Washington nor Microsoft,
 *      nor the names of its contributors may be used to endorse or promote
 *      products derived from this software without specific prior written
 *      permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL Jacob O. Wobbrock OR Andrew D. Wilson
 * OR Yang Li BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
 * OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
**/
//
// Point class
//
function Point(x, y) // constructor
{
	this.X = x;
	this.Y = y;
}
//
// Rectangle class
//
function Rectangle(x, y, width, height) // constructor
{
	this.X = x;
	this.Y = y;
	this.Width = width;
	this.Height = height;
}
//
// Unistroke class: a unistroke template
//
function Unistroke(name, points) // constructor
{
	this.Name = name;
	this.Points = Resample(points, NumPoints);
	var radians = IndicativeAngle(this.Points);
	this.Points = RotateBy(this.Points, -radians);
	this.Points = ScaleTo(this.Points, SquareSize);
	this.Points = TranslateTo(this.Points, Origin);
	this.Vector = Vectorize(this.Points); // for Protractor
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
// DollarRecognizer class constants
//
var NumUnistrokes = 16;
var NumPoints = 64;
var SquareSize = 250.0;
var Origin = new Point(0,0);
var Diagonal = Math.sqrt(SquareSize * SquareSize + SquareSize * SquareSize);
var HalfDiagonal = 0.5 * Diagonal;
var AngleRange = Deg2Rad(45.0);
var AnglePrecision = Deg2Rad(2.0);
var Phi = 0.5 * (-1.0 + Math.sqrt(5.0)); // Golden Ratio
//
// DollarRecognizer class
//
function DollarRecognizer() // constructor
{
	//
	// one built-in unistroke per gesture type
	//
	this.Unistrokes = new Array();

	this.Unistrokes[this.Unistrokes.length] = new Unistroke("play", new Array(new Point(180,162), new Point(181,163), new Point(184,168), new Point(188,171), new Point(193,175), new Point(197,179), new Point(200,180), new Point(201,181), new Point(201,182), new Point(201,182), new Point(202,183), new Point(204,183), new Point(205,184), new Point(205,185), new Point(206,185), new Point(206,186), new Point(205,187), new Point(204,189), new Point(201,191), new Point(199,193), new Point(198,195), new Point(196,197), new Point(196,199), new Point(193,200), new Point(193,201), new Point(191,203), new Point(190,204), new Point(189,206), new Point(189,207), new Point(189,208), new Point(188,209), new Point(188,210), new Point(186,210), new Point(185,211), new Point(185,212), new Point(184,212), new Point(184,213), new Point(183,213), new Point(183,214), new Point(182,214), new Point(182,213), new Point(182,212), new Point(182,211), new Point(182,210), new Point(182,209), new Point(182,208), new Point(182,206), new Point(182,205), new Point(182,204), new Point(182,203), new Point(182,202), new Point(182,201), new Point(182,199), new Point(181,198), new Point(181,197), new Point(181,196), new Point(180,194), new Point(180,193), new Point(180,192), new Point(180,190), new Point(180,189), new Point(180,188), new Point(180,187), new Point(179,187), new Point(179,186), new Point(179,185), new Point(179,184), new Point(179,183), new Point(179,182), new Point(179,181), new Point(179,180), new Point(179,180), new Point(179,179), new Point(179,178), new Point(179,178), new Point(179,177), new Point(179,176), new Point(179,175), new Point(179,174), new Point(179,173), new Point(179,172), new Point(179,171), new Point(179,170), new Point(179,170), new Point(179,169), new Point(179,168), new Point(179,167), new Point(179,166), new Point(179,165), new Point(179,164)))
	this.Unistrokes[this.Unistrokes.length] = new Unistroke("pause", new Array(new Point(175,170), new Point(176,170), new Point(179,170), new Point(184,170), new Point(189,170), new Point(192,170), new Point(195,170), new Point(197,170), new Point(199,170), new Point(201,170), new Point(202,170), new Point(203,170), new Point(204,170), new Point(204,171), new Point(204,173), new Point(204,177), new Point(204,180), new Point(204,183), new Point(204,185), new Point(204,187), new Point(205,188), new Point(205,189), new Point(205,190), new Point(205,191), new Point(205,194), new Point(205,194), new Point(205,195), new Point(205,196), new Point(205,197), new Point(205,198), new Point(205,199), new Point(204,199), new Point(202,199), new Point(200,199), new Point(198,199), new Point(196,199), new Point(193,199), new Point(191,199), new Point(189,199), new Point(187,198), new Point(185,198), new Point(184,198), new Point(183,197), new Point(182,197), new Point(181,197), new Point(180,197), new Point(179,197), new Point(178,197), new Point(178,196), new Point(178,195), new Point(178,194), new Point(178,192), new Point(178,190), new Point(178,188), new Point(178,187), new Point(178,186), new Point(178,185), new Point(178,185), new Point(178,184), new Point(178,183), new Point(178,182), new Point(178,181), new Point(178,180), new Point(178,179), new Point(178,178), new Point(178,177), new Point(178,176), new Point(178,175), new Point(178,174), new Point(178,173), new Point(178,172), new Point(178,171)))
	this.Unistrokes[this.Unistrokes.length] = new Unistroke("increaseVolume", new Array(new Point(181,229), new Point(181,228), new Point(181,221), new Point(181,214), new Point(181,205), new Point(181,199), new Point(181,194), new Point(181,189), new Point(181,186), new Point(181,184), new Point(181,183), new Point(181,181), new Point(181,179), new Point(181,178), new Point(180,178), new Point(179,180), new Point(176,183), new Point(173,186), new Point(171,189), new Point(169,191), new Point(169,191), new Point(168,193), new Point(166,194), new Point(165,194), new Point(165,195), new Point(164,197), new Point(164,198), new Point(164,198), new Point(164,199), new Point(163,199), new Point(164,199), new Point(167,199), new Point(170,199), new Point(174,199), new Point(177,199), new Point(181,199), new Point(184,200), new Point(187,200), new Point(190,200), new Point(192,200), new Point(194,200), new Point(196,200), new Point(197,200), new Point(198,200), new Point(198,199), new Point(196,197), new Point(195,196), new Point(194,193), new Point(191,192), new Point(191,191), new Point(190,190), new Point(190,189), new Point(189,188), new Point(188,187), new Point(187,186), new Point(187,185), new Point(186,185), new Point(186,184), new Point(185,183), new Point(184,183), new Point(184,182), new Point(183,182), new Point(183,181), new Point(182,180), new Point(182,179)))
	this.Unistrokes[this.Unistrokes.length] = new Unistroke("decreaseVolume", new Array(new Point(192,127), new Point(192,128), new Point(192,132), new Point(192,136), new Point(192,142), new Point(192,146), new Point(192,148), new Point(192,151), new Point(192,153), new Point(192,155), new Point(192,157), new Point(192,159), new Point(192,160), new Point(192,161), new Point(192,162), new Point(192,163), new Point(192,164), new Point(193,164), new Point(193,166), new Point(194,168), new Point(195,169), new Point(195,170), new Point(196,170), new Point(196,171), new Point(195,171), new Point(193,169), new Point(190,168), new Point(187,166), new Point(185,165), new Point(181,163), new Point(178,162), new Point(176,159), new Point(174,158), new Point(172,157), new Point(170,156), new Point(170,156), new Point(169,156), new Point(169,155), new Point(168,155), new Point(169,155), new Point(172,155), new Point(175,155), new Point(180,155), new Point(183,155), new Point(187,155), new Point(192,155), new Point(194,155), new Point(197,155), new Point(201,155), new Point(203,155), new Point(206,155), new Point(209,154), new Point(211,154), new Point(212,152), new Point(213,152), new Point(214,152), new Point(215,152), new Point(216,152), new Point(217,152), new Point(216,153), new Point(213,156), new Point(212,157), new Point(211,158), new Point(210,158), new Point(208,159), new Point(207,160), new Point(206,160), new Point(206,161), new Point(205,163), new Point(204,163), new Point(203,164), new Point(202,164), new Point(200,165), new Point(200,166), new Point(199,166), new Point(199,167), new Point(198,167), new Point(197,168), new Point(196,168), new Point(196,169), new Point(195,169), new Point(194,170), new Point(194,171)))
	this.Unistrokes[this.Unistrokes.length] = new Unistroke("muted", new Array(new Point(119,192), new Point(121,192), new Point(125,192), new Point(129,192), new Point(132,192), new Point(136,192), new Point(138,193), new Point(142,193), new Point(145,193), new Point(147,194), new Point(149,194), new Point(150,195), new Point(151,195), new Point(153,195), new Point(154,195), new Point(154,195), new Point(155,196), new Point(156,196), new Point(157,196), new Point(157,195), new Point(157,194), new Point(157,193), new Point(157,192), new Point(157,191), new Point(157,190), new Point(156,189), new Point(156,188), new Point(155,187), new Point(155,186), new Point(154,185), new Point(154,184), new Point(153,182), new Point(152,181), new Point(152,180), new Point(151,179), new Point(150,178), new Point(150,177), new Point(149,176), new Point(148,176), new Point(148,175), new Point(148,174), new Point(147,174), new Point(146,174), new Point(146,173), new Point(145,173), new Point(144,173), new Point(144,173), new Point(143,172), new Point(142,172), new Point(141,172), new Point(140,171), new Point(139,171), new Point(138,171), new Point(137,171), new Point(136,171), new Point(136,171), new Point(135,171), new Point(134,171), new Point(133,171), new Point(132,171), new Point(131,171), new Point(132,172), new Point(131,172), new Point(130,172), new Point(129,172), new Point(128,172), new Point(127,172), new Point(127,173), new Point(126,173), new Point(125,174), new Point(124,174), new Point(124,175), new Point(124,175), new Point(124,176), new Point(123,176), new Point(123,176), new Point(122,176), new Point(122,177), new Point(121,177), new Point(121,178), new Point(120,178), new Point(120,179), new Point(119,180), new Point(119,181), new Point(118,181), new Point(118,182), new Point(117,183), new Point(117,184), new Point(117,185), new Point(116,186), new Point(116,187), new Point(116,187), new Point(115,188), new Point(115,189), new Point(115,190), new Point(115,191), new Point(115,192), new Point(115,193), new Point(115,194), new Point(115,195), new Point(115,195), new Point(115,196), new Point(116,197), new Point(116,199), new Point(117,199), new Point(117,200), new Point(118,201), new Point(118,202), new Point(119,202), new Point(119,203), new Point(120,203), new Point(121,203), new Point(122,203), new Point(122,204), new Point(123,204), new Point(123,205), new Point(124,205), new Point(125,205), new Point(126,206), new Point(127,206), new Point(127,207), new Point(128,207), new Point(128,207), new Point(129,208), new Point(130,208), new Point(130,209), new Point(131,209), new Point(132,209), new Point(134,209), new Point(135,210), new Point(136,210), new Point(136,210), new Point(137,210), new Point(138,210), new Point(139,210), new Point(140,210), new Point(141,210), new Point(142,210), new Point(143,210), new Point(144,210), new Point(145,210), new Point(146,210), new Point(147,210), new Point(148,210), new Point(148,209), new Point(149,209), new Point(149,208), new Point(150,208), new Point(151,208), new Point(152,207), new Point(152,206), new Point(153,206), new Point(153,205), new Point(153,204), new Point(154,204), new Point(154,203), new Point(154,202), new Point(154,201), new Point(155,201), new Point(155,200), new Point(155,199), new Point(155,198), new Point(155,197), new Point(155,196), new Point(155,195), new Point(155,194), new Point(155,194), new Point(155,193), new Point(155,192), new Point(156,193)))
	this.Unistrokes[this.Unistrokes.length] = new Unistroke("increasePlaybackRate", new Array(new Point(158,116), new Point(159,116), new Point(165,116), new Point(177,120), new Point(187,126), new Point(194,130), new Point(203,135), new Point(209,139), new Point(213,141), new Point(216,143), new Point(217,144), new Point(218,144), new Point(219,145), new Point(218,145), new Point(211,146), new Point(206,148), new Point(198,150), new Point(191,152), new Point(187,153), new Point(184,155), new Point(181,156), new Point(178,157), new Point(176,158), new Point(173,159), new Point(172,160), new Point(170,160), new Point(169,161), new Point(168,161), new Point(166,161), new Point(165,162), new Point(164,162), new Point(163,163), new Point(162,165), new Point(161,165), new Point(160,166), new Point(159,166)))
	this.Unistrokes[this.Unistrokes.length] = new Unistroke("decreasePlaybackRate", new Array(new Point(211,130), new Point(210,130), new Point(204,131), new Point(195,136), new Point(185,140), new Point(181,143), new Point(176,145), new Point(173,148), new Point(171,149), new Point(170,150), new Point(169,152), new Point(167,152), new Point(166,153), new Point(165,154), new Point(164,155), new Point(163,156), new Point(163,157), new Point(164,157), new Point(169,158), new Point(175,160), new Point(181,161), new Point(190,164), new Point(195,165), new Point(201,168), new Point(204,170), new Point(208,171), new Point(211,172), new Point(214,173), new Point(216,173), new Point(217,174), new Point(218,174), new Point(218,175)))
	this.Unistrokes[this.Unistrokes.length] = new Unistroke("seekPlus", new Array(new Point(190,157), new Point(191,157), new Point(192,157), new Point(194,157), new Point(198,158), new Point(201,160), new Point(204,161), new Point(207,162), new Point(209,163), new Point(212,164), new Point(216,166), new Point(218,167), new Point(220,169), new Point(222,171), new Point(223,172), new Point(224,175), new Point(225,178), new Point(226,181), new Point(226,183), new Point(227,186), new Point(227,188), new Point(227,190), new Point(227,191), new Point(227,193), new Point(227,195), new Point(227,197), new Point(227,199), new Point(227,202), new Point(226,204), new Point(225,205), new Point(224,206), new Point(223,208), new Point(222,208), new Point(221,209), new Point(220,210), new Point(219,211), new Point(218,212), new Point(216,213), new Point(213,213), new Point(211,214), new Point(208,215), new Point(207,215), new Point(206,215), new Point(205,215), new Point(203,216), new Point(202,216), new Point(201,216), new Point(199,216), new Point(198,216), new Point(197,216), new Point(196,216), new Point(195,216), new Point(193,217), new Point(192,217), new Point(191,217), new Point(190,217), new Point(189,217), new Point(188,217), new Point(187,217), new Point(186,217), new Point(186,217), new Point(185,217), new Point(184,217), new Point(183,217), new Point(183,216), new Point(183,215), new Point(184,214), new Point(185,213), new Point(185,212), new Point(186,211), new Point(187,209), new Point(188,208), new Point(189,206), new Point(190,205), new Point(190,204), new Point(191,203), new Point(192,202), new Point(192,201), new Point(193,201), new Point(193,200), new Point(193,199), new Point(193,198), new Point(193,200), new Point(193,202), new Point(193,204), new Point(193,207), new Point(193,208), new Point(193,209), new Point(193,211), new Point(194,212), new Point(194,213), new Point(195,216), new Point(195,217), new Point(195,217), new Point(195,218), new Point(195,219), new Point(195,220), new Point(195,221), new Point(195,222), new Point(195,223), new Point(197,223), new Point(197,224), new Point(197,225), new Point(197,226), new Point(197,227), new Point(197,228), new Point(197,229), new Point(197,230), new Point(197,231), new Point(197,232), new Point(197,232), new Point(196,232), new Point(196,231), new Point(194,230), new Point(192,229), new Point(191,228), new Point(190,227), new Point(190,226), new Point(189,225), new Point(188,224), new Point(188,223), new Point(186,223), new Point(185,222), new Point(185,221), new Point(184,221), new Point(184,220), new Point(184,219), new Point(183,219), new Point(183,218), new Point(183,217)))
	this.Unistrokes[this.Unistrokes.length] = new Unistroke("seekMinus", new Array(new Point(260,280), new Point(261,280), new Point(262,280), new Point(264,280), new Point(265,280), new Point(269,279), new Point(272,277), new Point(276,274), new Point(280,270), new Point(283,268), new Point(286,265), new Point(288,263), new Point(290,261), new Point(291,258), new Point(293,255), new Point(294,253), new Point(295,251), new Point(296,249), new Point(297,247), new Point(299,246), new Point(299,244), new Point(299,242), new Point(299,241), new Point(299,240), new Point(299,238), new Point(299,237), new Point(299,234), new Point(299,232), new Point(297,229), new Point(296,227), new Point(296,226), new Point(295,224), new Point(294,223), new Point(294,222), new Point(293,219), new Point(292,217), new Point(291,215), new Point(291,214), new Point(289,213), new Point(288,212), new Point(287,210), new Point(286,209), new Point(285,208), new Point(284,207), new Point(283,206), new Point(282,204), new Point(280,203), new Point(279,202), new Point(278,202), new Point(277,202), new Point(276,201), new Point(275,201), new Point(275,200), new Point(274,200), new Point(272,200), new Point(271,199), new Point(271,199), new Point(270,199), new Point(269,199), new Point(268,199), new Point(267,199), new Point(266,198), new Point(265,198), new Point(264,198), new Point(263,198), new Point(262,198), new Point(261,198), new Point(260,198), new Point(259,198), new Point(258,198), new Point(257,198), new Point(256,198), new Point(255,198), new Point(255,198), new Point(255,198), new Point(255,199), new Point(255,200), new Point(256,201), new Point(256,202), new Point(257,202), new Point(257,203), new Point(258,204), new Point(259,205), new Point(260,207), new Point(261,208), new Point(262,209), new Point(263,211), new Point(265,212), new Point(266,213), new Point(267,215), new Point(268,216), new Point(269,217), new Point(270,219), new Point(271,220), new Point(271,222), new Point(272,223), new Point(273,223), new Point(273,224), new Point(274,224), new Point(274,225), new Point(275,225), new Point(275,224), new Point(275,220), new Point(275,216), new Point(274,209), new Point(272,203), new Point(271,199), new Point(271,195), new Point(270,192), new Point(269,189), new Point(269,187), new Point(269,186), new Point(269,185), new Point(269,184), new Point(269,183), new Point(269,182), new Point(269,181), new Point(269,180), new Point(268,180), new Point(267,180), new Point(266,180), new Point(265,181), new Point(265,182), new Point(264,183), new Point(263,184), new Point(262,185), new Point(262,186), new Point(261,187), new Point(260,187), new Point(260,188), new Point(259,188), new Point(259,189), new Point(258,189), new Point(258,190), new Point(257,190), new Point(257,191), new Point(256,191), new Point(256,192), new Point(256,193), new Point(255,193), new Point(255,194), new Point(255,195), new Point(255,196), new Point(254,196), new Point(254,197), new Point(254,197)))
	this.Unistrokes[this.Unistrokes.length] = new Unistroke("increaseWidth", new Array(new Point(76,236), new Point(78,235), new Point(81,233), new Point(84,230), new Point(87,228), new Point(88,225), new Point(89,225), new Point(90,225), new Point(90,225), new Point(91,225), new Point(91,224), new Point(92,224), new Point(92,223), new Point(93,222), new Point(93,221), new Point(94,221), new Point(95,221), new Point(95,220), new Point(95,219), new Point(96,219), new Point(96,218), new Point(96,219), new Point(96,221), new Point(96,225), new Point(96,229), new Point(96,234), new Point(96,239), new Point(96,245), new Point(96,248), new Point(96,250), new Point(96,252), new Point(96,253), new Point(95,255), new Point(95,256), new Point(95,257), new Point(95,259), new Point(95,260), new Point(95,260), new Point(95,261), new Point(94,261), new Point(93,259), new Point(91,258), new Point(90,255), new Point(88,253), new Point(86,250), new Point(84,248), new Point(83,247), new Point(81,245), new Point(80,243), new Point(79,242), new Point(78,241), new Point(78,240), new Point(77,240), new Point(77,239), new Point(76,239), new Point(76,238), new Point(76,237), new Point(75,237), new Point(75,236), new Point(76,236), new Point(78,236), new Point(82,236), new Point(87,236), new Point(93,236), new Point(98,237), new Point(103,239), new Point(107,240), new Point(111,241), new Point(115,241), new Point(118,241), new Point(120,241), new Point(124,242), new Point(127,243), new Point(130,243), new Point(134,244), new Point(136,244), new Point(139,244), new Point(141,244), new Point(143,244), new Point(145,244), new Point(149,244), new Point(151,244), new Point(153,244), new Point(155,244), new Point(156,244), new Point(157,244), new Point(158,244), new Point(159,244), new Point(159,243), new Point(157,241), new Point(156,239), new Point(154,237), new Point(152,235), new Point(150,232), new Point(148,230), new Point(147,229), new Point(145,227), new Point(143,225), new Point(142,224), new Point(141,222), new Point(140,222), new Point(140,221), new Point(140,221), new Point(140,222), new Point(140,224), new Point(140,227), new Point(140,230), new Point(140,234), new Point(140,237), new Point(140,240), new Point(140,241), new Point(140,242), new Point(140,243), new Point(140,245), new Point(140,246), new Point(140,247), new Point(140,249), new Point(140,250), new Point(140,250), new Point(140,251), new Point(140,252), new Point(140,253), new Point(140,254), new Point(140,255), new Point(140,256), new Point(140,257), new Point(140,258), new Point(140,259), new Point(141,259), new Point(142,258), new Point(143,257), new Point(144,256), new Point(144,256), new Point(145,255), new Point(146,255), new Point(148,253), new Point(149,252), new Point(150,251), new Point(151,251), new Point(152,250), new Point(153,250), new Point(153,249), new Point(154,249), new Point(155,249), new Point(157,248), new Point(157,247), new Point(158,247), new Point(159,246), new Point(159,246), new Point(159,245), new Point(160,245)))
	this.Unistrokes[this.Unistrokes.length] = new Unistroke("increaseHeight", new Array(new Point(199,91), new Point(198,91), new Point(195,94), new Point(191,99), new Point(187,103), new Point(182,109), new Point(177,116), new Point(173,120), new Point(170,122), new Point(169,123), new Point(168,124), new Point(168,125), new Point(170,125), new Point(175,125), new Point(183,125), new Point(191,125), new Point(199,125), new Point(208,125), new Point(213,125), new Point(218,125), new Point(220,125), new Point(222,125), new Point(223,125), new Point(224,125), new Point(225,125), new Point(225,124), new Point(224,122), new Point(221,119), new Point(219,115), new Point(216,110), new Point(213,106), new Point(209,103), new Point(208,102), new Point(207,100), new Point(206,99), new Point(205,98), new Point(204,97), new Point(204,96), new Point(203,96), new Point(203,95), new Point(202,95), new Point(202,94), new Point(201,94), new Point(201,95), new Point(201,99), new Point(201,108), new Point(200,121), new Point(200,135), new Point(199,150), new Point(197,163), new Point(197,171), new Point(196,179), new Point(196,186), new Point(196,191), new Point(195,194), new Point(195,197), new Point(195,199), new Point(194,201), new Point(194,202), new Point(194,204), new Point(194,205), new Point(194,205), new Point(194,206), new Point(194,207), new Point(194,208), new Point(194,209), new Point(194,210), new Point(194,211), new Point(193,211), new Point(190,208), new Point(188,204), new Point(185,201), new Point(183,198), new Point(181,196), new Point(180,195), new Point(178,194), new Point(178,193), new Point(177,191), new Point(176,189), new Point(176,188), new Point(175,188), new Point(175,187), new Point(174,187), new Point(174,186), new Point(173,184), new Point(173,183), new Point(172,182), new Point(172,181), new Point(171,181), new Point(171,180), new Point(172,180), new Point(176,180), new Point(182,180), new Point(187,180), new Point(194,180), new Point(200,180), new Point(207,180), new Point(211,180), new Point(214,180), new Point(216,180), new Point(218,180), new Point(220,180), new Point(222,180), new Point(223,180), new Point(223,181), new Point(223,182), new Point(222,184), new Point(220,187), new Point(218,189), new Point(215,192), new Point(213,194), new Point(211,195), new Point(210,197), new Point(208,198), new Point(207,199), new Point(206,200), new Point(205,201), new Point(204,202), new Point(203,203), new Point(202,204), new Point(201,205), new Point(200,206), new Point(200,207), new Point(199,207), new Point(199,208), new Point(199,208), new Point(198,209), new Point(198,210), new Point(197,210), new Point(197,211), new Point(196,211), new Point(195,212), new Point(195,213), new Point(194,213)))

	/*
	this.Unistrokes[0] = new Unistroke("triangle", new Array(new Point(137,139),new Point(135,141),new Point(133,144),new Point(132,146),new Point(130,149),new Point(128,151),new Point(126,155),new Point(123,160),new Point(120,166),new Point(116,171),new Point(112,177),new Point(107,183),new Point(102,188),new Point(100,191),new Point(95,195),new Point(90,199),new Point(86,203),new Point(82,206),new Point(80,209),new Point(75,213),new Point(73,213),new Point(70,216),new Point(67,219),new Point(64,221),new Point(61,223),new Point(60,225),new Point(62,226),new Point(65,225),new Point(67,226),new Point(74,226),new Point(77,227),new Point(85,229),new Point(91,230),new Point(99,231),new Point(108,232),new Point(116,233),new Point(125,233),new Point(134,234),new Point(145,233),new Point(153,232),new Point(160,233),new Point(170,234),new Point(177,235),new Point(179,236),new Point(186,237),new Point(193,238),new Point(198,239),new Point(200,237),new Point(202,239),new Point(204,238),new Point(206,234),new Point(205,230),new Point(202,222),new Point(197,216),new Point(192,207),new Point(186,198),new Point(179,189),new Point(174,183),new Point(170,178),new Point(164,171),new Point(161,168),new Point(154,160),new Point(148,155),new Point(143,150),new Point(138,148),new Point(136,148)));
	this.Unistrokes[1] = new Unistroke("x", new Array(new Point(87,142),new Point(89,145),new Point(91,148),new Point(93,151),new Point(96,155),new Point(98,157),new Point(100,160),new Point(102,162),new Point(106,167),new Point(108,169),new Point(110,171),new Point(115,177),new Point(119,183),new Point(123,189),new Point(127,193),new Point(129,196),new Point(133,200),new Point(137,206),new Point(140,209),new Point(143,212),new Point(146,215),new Point(151,220),new Point(153,222),new Point(155,223),new Point(157,225),new Point(158,223),new Point(157,218),new Point(155,211),new Point(154,208),new Point(152,200),new Point(150,189),new Point(148,179),new Point(147,170),new Point(147,158),new Point(147,148),new Point(147,141),new Point(147,136),new Point(144,135),new Point(142,137),new Point(140,139),new Point(135,145),new Point(131,152),new Point(124,163),new Point(116,177),new Point(108,191),new Point(100,206),new Point(94,217),new Point(91,222),new Point(89,225),new Point(87,226),new Point(87,224)));
	this.Unistrokes[2] = new Unistroke("rectangle", new Array(new Point(78,149),new Point(78,153),new Point(78,157),new Point(78,160),new Point(79,162),new Point(79,164),new Point(79,167),new Point(79,169),new Point(79,173),new Point(79,178),new Point(79,183),new Point(80,189),new Point(80,193),new Point(80,198),new Point(80,202),new Point(81,208),new Point(81,210),new Point(81,216),new Point(82,222),new Point(82,224),new Point(82,227),new Point(83,229),new Point(83,231),new Point(85,230),new Point(88,232),new Point(90,233),new Point(92,232),new Point(94,233),new Point(99,232),new Point(102,233),new Point(106,233),new Point(109,234),new Point(117,235),new Point(123,236),new Point(126,236),new Point(135,237),new Point(142,238),new Point(145,238),new Point(152,238),new Point(154,239),new Point(165,238),new Point(174,237),new Point(179,236),new Point(186,235),new Point(191,235),new Point(195,233),new Point(197,233),new Point(200,233),new Point(201,235),new Point(201,233),new Point(199,231),new Point(198,226),new Point(198,220),new Point(196,207),new Point(195,195),new Point(195,181),new Point(195,173),new Point(195,163),new Point(194,155),new Point(192,145),new Point(192,143),new Point(192,138),new Point(191,135),new Point(191,133),new Point(191,130),new Point(190,128),new Point(188,129),new Point(186,129),new Point(181,132),new Point(173,131),new Point(162,131),new Point(151,132),new Point(149,132),new Point(138,132),new Point(136,132),new Point(122,131),new Point(120,131),new Point(109,130),new Point(107,130),new Point(90,132),new Point(81,133),new Point(76,133)));
	this.Unistrokes[3] = new Unistroke("circle", new Array(new Point(127,141),new Point(124,140),new Point(120,139),new Point(118,139),new Point(116,139),new Point(111,140),new Point(109,141),new Point(104,144),new Point(100,147),new Point(96,152),new Point(93,157),new Point(90,163),new Point(87,169),new Point(85,175),new Point(83,181),new Point(82,190),new Point(82,195),new Point(83,200),new Point(84,205),new Point(88,213),new Point(91,216),new Point(96,219),new Point(103,222),new Point(108,224),new Point(111,224),new Point(120,224),new Point(133,223),new Point(142,222),new Point(152,218),new Point(160,214),new Point(167,210),new Point(173,204),new Point(178,198),new Point(179,196),new Point(182,188),new Point(182,177),new Point(178,167),new Point(170,150),new Point(163,138),new Point(152,130),new Point(143,129),new Point(140,131),new Point(129,136),new Point(126,139)));
	this.Unistrokes[4] = new Unistroke("check", new Array(new Point(91,185),new Point(93,185),new Point(95,185),new Point(97,185),new Point(100,188),new Point(102,189),new Point(104,190),new Point(106,193),new Point(108,195),new Point(110,198),new Point(112,201),new Point(114,204),new Point(115,207),new Point(117,210),new Point(118,212),new Point(120,214),new Point(121,217),new Point(122,219),new Point(123,222),new Point(124,224),new Point(126,226),new Point(127,229),new Point(129,231),new Point(130,233),new Point(129,231),new Point(129,228),new Point(129,226),new Point(129,224),new Point(129,221),new Point(129,218),new Point(129,212),new Point(129,208),new Point(130,198),new Point(132,189),new Point(134,182),new Point(137,173),new Point(143,164),new Point(147,157),new Point(151,151),new Point(155,144),new Point(161,137),new Point(165,131),new Point(171,122),new Point(174,118),new Point(176,114),new Point(177,112),new Point(177,114),new Point(175,116),new Point(173,118)));
	this.Unistrokes[5] = new Unistroke("caret", new Array(new Point(79,245),new Point(79,242),new Point(79,239),new Point(80,237),new Point(80,234),new Point(81,232),new Point(82,230),new Point(84,224),new Point(86,220),new Point(86,218),new Point(87,216),new Point(88,213),new Point(90,207),new Point(91,202),new Point(92,200),new Point(93,194),new Point(94,192),new Point(96,189),new Point(97,186),new Point(100,179),new Point(102,173),new Point(105,165),new Point(107,160),new Point(109,158),new Point(112,151),new Point(115,144),new Point(117,139),new Point(119,136),new Point(119,134),new Point(120,132),new Point(121,129),new Point(122,127),new Point(124,125),new Point(126,124),new Point(129,125),new Point(131,127),new Point(132,130),new Point(136,139),new Point(141,154),new Point(145,166),new Point(151,182),new Point(156,193),new Point(157,196),new Point(161,209),new Point(162,211),new Point(167,223),new Point(169,229),new Point(170,231),new Point(173,237),new Point(176,242),new Point(177,244),new Point(179,250),new Point(181,255),new Point(182,257)));
	this.Unistrokes[6] = new Unistroke("zig-zag", new Array(new Point(307,216),new Point(333,186),new Point(356,215),new Point(375,186),new Point(399,216),new Point(418,186)));
	this.Unistrokes[7] = new Unistroke("arrow", new Array(new Point(68,222),new Point(70,220),new Point(73,218),new Point(75,217),new Point(77,215),new Point(80,213),new Point(82,212),new Point(84,210),new Point(87,209),new Point(89,208),new Point(92,206),new Point(95,204),new Point(101,201),new Point(106,198),new Point(112,194),new Point(118,191),new Point(124,187),new Point(127,186),new Point(132,183),new Point(138,181),new Point(141,180),new Point(146,178),new Point(154,173),new Point(159,171),new Point(161,170),new Point(166,167),new Point(168,167),new Point(171,166),new Point(174,164),new Point(177,162),new Point(180,160),new Point(182,158),new Point(183,156),new Point(181,154),new Point(178,153),new Point(171,153),new Point(164,153),new Point(160,153),new Point(150,154),new Point(147,155),new Point(141,157),new Point(137,158),new Point(135,158),new Point(137,158),new Point(140,157),new Point(143,156),new Point(151,154),new Point(160,152),new Point(170,149),new Point(179,147),new Point(185,145),new Point(192,144),new Point(196,144),new Point(198,144),new Point(200,144),new Point(201,147),new Point(199,149),new Point(194,157),new Point(191,160),new Point(186,167),new Point(180,176),new Point(177,179),new Point(171,187),new Point(169,189),new Point(165,194),new Point(164,196)));
	this.Unistrokes[8] = new Unistroke("left square bracket", new Array(new Point(140,124),new Point(138,123),new Point(135,122),new Point(133,123),new Point(130,123),new Point(128,124),new Point(125,125),new Point(122,124),new Point(120,124),new Point(118,124),new Point(116,125),new Point(113,125),new Point(111,125),new Point(108,124),new Point(106,125),new Point(104,125),new Point(102,124),new Point(100,123),new Point(98,123),new Point(95,124),new Point(93,123),new Point(90,124),new Point(88,124),new Point(85,125),new Point(83,126),new Point(81,127),new Point(81,129),new Point(82,131),new Point(82,134),new Point(83,138),new Point(84,141),new Point(84,144),new Point(85,148),new Point(85,151),new Point(86,156),new Point(86,160),new Point(86,164),new Point(86,168),new Point(87,171),new Point(87,175),new Point(87,179),new Point(87,182),new Point(87,186),new Point(88,188),new Point(88,195),new Point(88,198),new Point(88,201),new Point(88,207),new Point(89,211),new Point(89,213),new Point(89,217),new Point(89,222),new Point(88,225),new Point(88,229),new Point(88,231),new Point(88,233),new Point(88,235),new Point(89,237),new Point(89,240),new Point(89,242),new Point(91,241),new Point(94,241),new Point(96,240),new Point(98,239),new Point(105,240),new Point(109,240),new Point(113,239),new Point(116,240),new Point(121,239),new Point(130,240),new Point(136,237),new Point(139,237),new Point(144,238),new Point(151,237),new Point(157,236),new Point(159,237)));
	this.Unistrokes[9] = new Unistroke("right square bracket", new Array(new Point(112,138),new Point(112,136),new Point(115,136),new Point(118,137),new Point(120,136),new Point(123,136),new Point(125,136),new Point(128,136),new Point(131,136),new Point(134,135),new Point(137,135),new Point(140,134),new Point(143,133),new Point(145,132),new Point(147,132),new Point(149,132),new Point(152,132),new Point(153,134),new Point(154,137),new Point(155,141),new Point(156,144),new Point(157,152),new Point(158,161),new Point(160,170),new Point(162,182),new Point(164,192),new Point(166,200),new Point(167,209),new Point(168,214),new Point(168,216),new Point(169,221),new Point(169,223),new Point(169,228),new Point(169,231),new Point(166,233),new Point(164,234),new Point(161,235),new Point(155,236),new Point(147,235),new Point(140,233),new Point(131,233),new Point(124,233),new Point(117,235),new Point(114,238),new Point(112,238)));
	this.Unistrokes[10] = new Unistroke("v", new Array(new Point(89,164),new Point(90,162),new Point(92,162),new Point(94,164),new Point(95,166),new Point(96,169),new Point(97,171),new Point(99,175),new Point(101,178),new Point(103,182),new Point(106,189),new Point(108,194),new Point(111,199),new Point(114,204),new Point(117,209),new Point(119,214),new Point(122,218),new Point(124,222),new Point(126,225),new Point(128,228),new Point(130,229),new Point(133,233),new Point(134,236),new Point(136,239),new Point(138,240),new Point(139,242),new Point(140,244),new Point(142,242),new Point(142,240),new Point(142,237),new Point(143,235),new Point(143,233),new Point(145,229),new Point(146,226),new Point(148,217),new Point(149,208),new Point(149,205),new Point(151,196),new Point(151,193),new Point(153,182),new Point(155,172),new Point(157,165),new Point(159,160),new Point(162,155),new Point(164,150),new Point(165,148),new Point(166,146)));
	this.Unistrokes[11] = new Unistroke("delete", new Array(new Point(123,129),new Point(123,131),new Point(124,133),new Point(125,136),new Point(127,140),new Point(129,142),new Point(133,148),new Point(137,154),new Point(143,158),new Point(145,161),new Point(148,164),new Point(153,170),new Point(158,176),new Point(160,178),new Point(164,183),new Point(168,188),new Point(171,191),new Point(175,196),new Point(178,200),new Point(180,202),new Point(181,205),new Point(184,208),new Point(186,210),new Point(187,213),new Point(188,215),new Point(186,212),new Point(183,211),new Point(177,208),new Point(169,206),new Point(162,205),new Point(154,207),new Point(145,209),new Point(137,210),new Point(129,214),new Point(122,217),new Point(118,218),new Point(111,221),new Point(109,222),new Point(110,219),new Point(112,217),new Point(118,209),new Point(120,207),new Point(128,196),new Point(135,187),new Point(138,183),new Point(148,167),new Point(157,153),new Point(163,145),new Point(165,142),new Point(172,133),new Point(177,127),new Point(179,127),new Point(180,125)));
	this.Unistrokes[12] = new Unistroke("left curly brace", new Array(new Point(150,116),new Point(147,117),new Point(145,116),new Point(142,116),new Point(139,117),new Point(136,117),new Point(133,118),new Point(129,121),new Point(126,122),new Point(123,123),new Point(120,125),new Point(118,127),new Point(115,128),new Point(113,129),new Point(112,131),new Point(113,134),new Point(115,134),new Point(117,135),new Point(120,135),new Point(123,137),new Point(126,138),new Point(129,140),new Point(135,143),new Point(137,144),new Point(139,147),new Point(141,149),new Point(140,152),new Point(139,155),new Point(134,159),new Point(131,161),new Point(124,166),new Point(121,166),new Point(117,166),new Point(114,167),new Point(112,166),new Point(114,164),new Point(116,163),new Point(118,163),new Point(120,162),new Point(122,163),new Point(125,164),new Point(127,165),new Point(129,166),new Point(130,168),new Point(129,171),new Point(127,175),new Point(125,179),new Point(123,184),new Point(121,190),new Point(120,194),new Point(119,199),new Point(120,202),new Point(123,207),new Point(127,211),new Point(133,215),new Point(142,219),new Point(148,220),new Point(151,221)));
	this.Unistrokes[13] = new Unistroke("right curly brace", new Array(new Point(117,132),new Point(115,132),new Point(115,129),new Point(117,129),new Point(119,128),new Point(122,127),new Point(125,127),new Point(127,127),new Point(130,127),new Point(133,129),new Point(136,129),new Point(138,130),new Point(140,131),new Point(143,134),new Point(144,136),new Point(145,139),new Point(145,142),new Point(145,145),new Point(145,147),new Point(145,149),new Point(144,152),new Point(142,157),new Point(141,160),new Point(139,163),new Point(137,166),new Point(135,167),new Point(133,169),new Point(131,172),new Point(128,173),new Point(126,176),new Point(125,178),new Point(125,180),new Point(125,182),new Point(126,184),new Point(128,187),new Point(130,187),new Point(132,188),new Point(135,189),new Point(140,189),new Point(145,189),new Point(150,187),new Point(155,186),new Point(157,185),new Point(159,184),new Point(156,185),new Point(154,185),new Point(149,185),new Point(145,187),new Point(141,188),new Point(136,191),new Point(134,191),new Point(131,192),new Point(129,193),new Point(129,195),new Point(129,197),new Point(131,200),new Point(133,202),new Point(136,206),new Point(139,211),new Point(142,215),new Point(145,220),new Point(147,225),new Point(148,231),new Point(147,239),new Point(144,244),new Point(139,248),new Point(134,250),new Point(126,253),new Point(119,253),new Point(115,253)));
	this.Unistrokes[14] = new Unistroke("star", new Array(new Point(75,250),new Point(75,247),new Point(77,244),new Point(78,242),new Point(79,239),new Point(80,237),new Point(82,234),new Point(82,232),new Point(84,229),new Point(85,225),new Point(87,222),new Point(88,219),new Point(89,216),new Point(91,212),new Point(92,208),new Point(94,204),new Point(95,201),new Point(96,196),new Point(97,194),new Point(98,191),new Point(100,185),new Point(102,178),new Point(104,173),new Point(104,171),new Point(105,164),new Point(106,158),new Point(107,156),new Point(107,152),new Point(108,145),new Point(109,141),new Point(110,139),new Point(112,133),new Point(113,131),new Point(116,127),new Point(117,125),new Point(119,122),new Point(121,121),new Point(123,120),new Point(125,122),new Point(125,125),new Point(127,130),new Point(128,133),new Point(131,143),new Point(136,153),new Point(140,163),new Point(144,172),new Point(145,175),new Point(151,189),new Point(156,201),new Point(161,213),new Point(166,225),new Point(169,233),new Point(171,236),new Point(174,243),new Point(177,247),new Point(178,249),new Point(179,251),new Point(180,253),new Point(180,255),new Point(179,257),new Point(177,257),new Point(174,255),new Point(169,250),new Point(164,247),new Point(160,245),new Point(149,238),new Point(138,230),new Point(127,221),new Point(124,220),new Point(112,212),new Point(110,210),new Point(96,201),new Point(84,195),new Point(74,190),new Point(64,182),new Point(55,175),new Point(51,172),new Point(49,170),new Point(51,169),new Point(56,169),new Point(66,169),new Point(78,168),new Point(92,166),new Point(107,164),new Point(123,161),new Point(140,162),new Point(156,162),new Point(171,160),new Point(173,160),new Point(186,160),new Point(195,160),new Point(198,161),new Point(203,163),new Point(208,163),new Point(206,164),new Point(200,167),new Point(187,172),new Point(174,179),new Point(172,181),new Point(153,192),new Point(137,201),new Point(123,211),new Point(112,220),new Point(99,229),new Point(90,237),new Point(80,244),new Point(73,250),new Point(69,254),new Point(69,252)));
	//this.Unistrokes[15] = new Unistroke("pigtail", new Array(new Point(81,219),new Point(84,218),new Point(86,220),new Point(88,220),new Point(90,220),new Point(92,219),new Point(95,220),new Point(97,219),new Point(99,220),new Point(102,218),new Point(105,217),new Point(107,216),new Point(110,216),new Point(113,214),new Point(116,212),new Point(118,210),new Point(121,208),new Point(124,205),new Point(126,202),new Point(129,199),new Point(132,196),new Point(136,191),new Point(139,187),new Point(142,182),new Point(144,179),new Point(146,174),new Point(148,170),new Point(149,168),new Point(151,162),new Point(152,160),new Point(152,157),new Point(152,155),new Point(152,151),new Point(152,149),new Point(152,146),new Point(149,142),new Point(148,139),new Point(145,137),new Point(141,135),new Point(139,135),new Point(134,136),new Point(130,140),new Point(128,142),new Point(126,145),new Point(122,150),new Point(119,158),new Point(117,163),new Point(115,170),new Point(114,175),new Point(117,184),new Point(120,190),new Point(125,199),new Point(129,203),new Point(133,208),new Point(138,213),new Point(145,215),new Point(155,218),new Point(164,219),new Point(166,219),new Point(177,219),new Point(182,218),new Point(192,216),new Point(196,213),new Point(199,212),new Point(201,211)));
	*/

	
	

	//
	// The $1 Gesture Recognizer API begins here -- 3 methods: Recognize(), AddGesture(), and DeleteUserGestures()
	//
	this.Recognize = function(points, useProtractor)
	{
		points = Resample(points, NumPoints);
		var radians = IndicativeAngle(points);
		points = RotateBy(points, -radians);
		points = ScaleTo(points, SquareSize);
		points = TranslateTo(points, Origin);
		var vector = Vectorize(points); // for Protractor

		var b = +Infinity;
		var u = -1;
		for (var i = 0; i < this.Unistrokes.length; i++) // for each unistroke
		{
			var d;
			if (useProtractor) // for Protractor
				d = OptimalCosineDistance(this.Unistrokes[i].Vector, vector);
			else // Golden Section Search (original $1)
				d = DistanceAtBestAngle(points, this.Unistrokes[i], -AngleRange, +AngleRange, AnglePrecision);
			if (d < b) {
				b = d; // best (least) distance
				u = i; // unistroke
			}
		}
		return (u == -1) ? new Result("No match.", 0.0) : new Result(this.Unistrokes[u].Name, useProtractor ? 1.0 / b : 1.0 - b / HalfDiagonal);
	};
	this.AddGesture = function(name, points)
	{
		this.Unistrokes[this.Unistrokes.length] = new Unistroke(name, points); // append new unistroke
		var num = 0;
		for (var i = 0; i < this.Unistrokes.length; i++) {
			if (this.Unistrokes[i].Name == name)
				num++;
		}
		return num;
	}
	this.DeleteUserGestures = function()
	{
		this.Unistrokes.length = NumUnistrokes; // clear any beyond the original set
		return NumUnistrokes;
	}
}
//
// Private helper functions from this point down
//
function Resample(points, n)
{
	var I = PathLength(points) / (n - 1); // interval length
	var D = 0.0;
	var newpoints = new Array(points[0]);
	for (var i = 1; i < points.length; i++)
	{
		var d = Distance(points[i - 1], points[i]);
		if ((D + d) >= I)
		{
			var qx = points[i - 1].X + ((I - D) / d) * (points[i].X - points[i - 1].X);
			var qy = points[i - 1].Y + ((I - D) / d) * (points[i].Y - points[i - 1].Y);
			var q = new Point(qx, qy);
			newpoints[newpoints.length] = q; // append new point 'q'
			points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i
			D = 0.0;
		}
		else D += d;
	}
	if (newpoints.length == n - 1) // somtimes we fall a rounding-error short of adding the last point, so add it if so
		newpoints[newpoints.length] = new Point(points[points.length - 1].X, points[points.length - 1].Y);
	return newpoints;
}
function IndicativeAngle(points)
{
	var c = Centroid(points);
	return Math.atan2(c.Y - points[0].Y, c.X - points[0].X);
}
function RotateBy(points, radians) // rotates points around centroid
{
	var c = Centroid(points);
	var cos = Math.cos(radians);
	var sin = Math.sin(radians);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = (points[i].X - c.X) * cos - (points[i].Y - c.Y) * sin + c.X
		var qy = (points[i].X - c.X) * sin + (points[i].Y - c.Y) * cos + c.Y;
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}
function ScaleTo(points, size) // non-uniform scale; assumes 2D gestures (i.e., no lines)
{
	var B = BoundingBox(points);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = points[i].X * (size / B.Width);
		var qy = points[i].Y * (size / B.Height);
		newpoints[newpoints.length] = new Point(qx, qy);
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
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}
function Vectorize(points) // for Protractor
{
	var sum = 0.0;
	var vector = new Array();
	for (var i = 0; i < points.length; i++) {
		vector[vector.length] = points[i].X;
		vector[vector.length] = points[i].Y;
		sum += points[i].X * points[i].X + points[i].Y * points[i].Y;
	}
	var magnitude = Math.sqrt(sum);
	for (var i = 0; i < vector.length; i++)
		vector[i] /= magnitude;
	return vector;
}
function OptimalCosineDistance(v1, v2) // for Protractor
{
	var a = 0.0;
	var b = 0.0;
	for (var i = 0; i < v1.length; i += 2) {
		a += v1[i] * v2[i] + v1[i + 1] * v2[i + 1];
                b += v1[i] * v2[i + 1] - v1[i + 1] * v2[i];
	}
	var angle = Math.atan(b / a);
	return Math.acos(a * Math.cos(angle) + b * Math.sin(angle));
}
function DistanceAtBestAngle(points, T, a, b, threshold)
{
	var x1 = Phi * a + (1.0 - Phi) * b;
	var f1 = DistanceAtAngle(points, T, x1);
	var x2 = (1.0 - Phi) * a + Phi * b;
	var f2 = DistanceAtAngle(points, T, x2);
	while (Math.abs(b - a) > threshold)
	{
		if (f1 < f2) {
			b = x2;
			x2 = x1;
			f2 = f1;
			x1 = Phi * a + (1.0 - Phi) * b;
			f1 = DistanceAtAngle(points, T, x1);
		} else {
			a = x1;
			x1 = x2;
			f1 = f2;
			x2 = (1.0 - Phi) * a + Phi * b;
			f2 = DistanceAtAngle(points, T, x2);
		}
	}
	return Math.min(f1, f2);
}
function DistanceAtAngle(points, T, radians)
{
	var newpoints = RotateBy(points, radians);
	return PathDistance(newpoints, T.Points);
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
	return new Point(x, y);
}
function BoundingBox(points)
{
	var minX = +Infinity, maxX = -Infinity, minY = +Infinity, maxY = -Infinity;
	for (var i = 0; i < points.length; i++) {
		minX = Math.min(minX, points[i].X);
		minY = Math.min(minY, points[i].Y);
		maxX = Math.max(maxX, points[i].X);
		maxY = Math.max(maxY, points[i].Y);
	}
	return new Rectangle(minX, minY, maxX - minX, maxY - minY);
}
function PathDistance(pts1, pts2)
{
	var d = 0.0;
	for (var i = 0; i < pts1.length; i++) // assumes pts1.length == pts2.length
		d += Distance(pts1[i], pts2[i]);
	return d / pts1.length;
}
function PathLength(points)
{
	var d = 0.0;
	for (var i = 1; i < points.length; i++)
		d += Distance(points[i - 1], points[i]);
	return d;
}
function Distance(p1, p2)
{
	var dx = p2.X - p1.X;
	var dy = p2.Y - p1.Y;
	return Math.sqrt(dx * dx + dy * dy);
}
function Deg2Rad(d) { return (d * Math.PI / 180.0); }